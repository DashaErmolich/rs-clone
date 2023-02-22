import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DEFAULT_SRC } from 'src/app/constants/constants';
import { SearchType } from 'src/app/enums/endpoints';
import {
  IAlbumResponse, IArtistResponse, IPlayListResponse, ITrackResponse,
} from 'src/app/models/api-response.models';
import { ILikedSearchResults, LikedSearchResults } from 'src/app/models/search.models';
import { AudioService } from 'src/app/services/audio.service';
import { DeezerRestApiService } from 'src/app/services/deezer-api.service';
import { StateService } from 'src/app/services/state.service';
import { ResponsiveService } from '../../../services/responsive.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit, OnDestroy {
  resultId!: number;

  result!: Partial<IArtistResponse> | Partial<IAlbumResponse> | Partial<IPlayListResponse>;

  result$!: Subscription;

  tracks: Partial<ITrackResponse>[] = [];

  tracks$!: Subscription;

  loading = true;

  tracksOfState: Partial<ITrackResponse>[] = [];

  trackList$!: Subscription;

  isPlay$!: Subscription;

  isPlay!: boolean;

  isPause$!: Subscription;

  routeParams$!: Subscription;

  isPause!: boolean;

  resultType!: string;

  isFirstPlay!: boolean;

  imgSrc!: string;

  title!: string;

  type!: LikedSearchResults;

  descriptionTitle!: string;

  descriptionSubTitle!: string;

  descriptionTitleInfo!: string;

  descriptionSubTitleInfo!: string;

  artistImg!: string;

  artistName!: string;

  albumRelease!: string;

  artistId!: number;

  isLiked!: boolean;

  likedSearchResults!: ILikedSearchResults;

  likedSearchResults$!: Subscription;

  isSmall = false;

  isHandset = false;

  isSmall$ = new Subscription();

  isHandset$ = new Subscription();

  subscriptions: Subscription[] = [];

  typeToShow!: string;

  constructor(
    private myState: StateService,
    private myAudio: AudioService,
    private deezerRestApiService: DeezerRestApiService,
    private route: ActivatedRoute,
    private responsive: ResponsiveService,
  ) {}

  ngOnInit(): void {
    this.isFirstPlay = true;

    this.routeParams$ = this.route.params.subscribe((params) => {
      [this.resultType] = Object.keys(params);
      this.resultId = Number(params[this.resultType]);
      switch (this.resultType) {
        case SearchType.artist:
          this.getArtist(this.resultId);
          break;
        case SearchType.album:
          this.getAlbum(this.resultId);
          break;
        case SearchType.playlist:
          this.getPlaylist(this.resultId);
          break;
        default:
          break;
      }
    });

    this.trackList$ = this.myState.trackList$.subscribe((tracks) => {
      this.tracksOfState = tracks;
    });

    this.isPlay$ = this.myAudio.isPlay$.subscribe((res) => { this.isPlay = res; });
    this.isPause$ = this.myAudio.isPause$.subscribe((res) => { this.isPause = res; });
    this.likedSearchResults$ = this.myState.likedSearchResults$.subscribe((res) => {
      this.likedSearchResults = res;
    });
    this.isSmall$ = this.responsive.isSmall$.subscribe((data) => {
      this.isSmall = data;
    });
    this.subscriptions.push(this.isSmall$);

    this.isHandset$ = this.responsive.isHandset$.subscribe((data) => {
      this.isHandset = data;
    });

    this.subscriptions.push(this.isHandset$);
  }

  ngOnDestroy(): void {
    if (this.trackList$) this.trackList$.unsubscribe();
    if (this.isPause$) this.isPause$.unsubscribe();
    if (this.isPlay$) this.isPlay$.unsubscribe();
    if (this.routeParams$) this.routeParams$.unsubscribe();
    if (this.result$) this.result$.unsubscribe();
    if (this.likedSearchResults$) this.likedSearchResults$.unsubscribe();
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  getArtist(id: number) {
    this.result$ = this.deezerRestApiService
      .getArtist(id)
      .subscribe((res) => {
        this.result = res;
        this.type = res.type as LikedSearchResults;
        if (this.type === 'artist') {
          this.typeToShow = 'search.results.artist';
          this.descriptionTitle = 'search.results.description.artist.albums';
          this.descriptionSubTitle = 'search.results.description.artist.fans';
        }
        this.imgSrc = res.picture_medium ? res.picture_medium : DEFAULT_SRC;
        this.title = res.name;
        this.descriptionTitleInfo = `: ${res.nb_album}`;
        this.descriptionSubTitleInfo = `: ${res.nb_fan}`;
        this.loading = false;
        this.isSearchResultLiked();
      });

    this.tracks$ = this.deezerRestApiService
      .getTracksByArtist(id)
      .subscribe((res) => {
        this.tracks = res.data;
        this.loading = false;
      });
  }

  getAlbum(id: number) {
    this.result$ = this.deezerRestApiService
      .getAlbum(id)
      .subscribe((res) => {
        this.result = res;
        this.type = res.type as LikedSearchResults;
        if (this.type === 'album') {
          this.typeToShow = 'search.results.album';
        }
        this.imgSrc = res.cover_medium ? res.cover_medium : DEFAULT_SRC;
        this.title = res.title;
        this.tracks = res.tracks.data;
        this.loading = false;
        this.artistImg = res.artist.picture_small!;
        this.artistName = res.artist.name!;
        this.albumRelease = res.release_date.slice(0, 4);
        this.artistId = Number(res.artist.id);
        this.isSearchResultLiked();
      });
  }

  getPlaylist(id: number) {
    this.result$ = this.deezerRestApiService
      .getPlayListTracks(id)
      .subscribe((res) => {
        this.result = res;
        this.type = res.type as LikedSearchResults;
        if (this.type === 'playlist') {
          this.typeToShow = 'search.results.playlist';
          this.descriptionTitle = 'search.results.description.playlist.creator';
          this.descriptionSubTitle = 'search.results.description.playlist.songs';
        }
        this.imgSrc = res.picture_medium ? res.picture_medium : DEFAULT_SRC;
        this.title = res.title;
        this.tracks = res.tracks.data;
        this.descriptionTitleInfo = `: ${res.creator.name}`;
        this.descriptionSubTitleInfo = `: ${res.nb_tracks}`;
        this.loading = false;
        this.isSearchResultLiked();
      });
  }

  playPause(trackIndex: number) {
    if (this.isFirstPlay) {
      this.myState.setTrackListInfo(this.tracks, trackIndex);
      this.myAudio.playTrack(String(this.tracksOfState[trackIndex].preview));
      this.isFirstPlay = false;
    }
    if (this.isPlay) {
      this.myAudio.pause();
    } else {
      this.myAudio.play();
    }
  }

  likeSearchResult() {
    this.isLiked = !this.isLiked;
    if (this.isLiked && typeof this.result.id === 'number') {
      this.myState.setLikedSearchResult(this.type, this.result.id);
    } else if (typeof this.result.id === 'number') {
      this.myState.removeLikedSearchResult(this.type, this.result.id);
    }
  }

  isSearchResultLiked() {
    const index = this.likedSearchResults[this.type]
      .findIndex((searchResultId) => searchResultId === this.result.id);
    const isLiked = index >= 0;
    this.isLiked = isLiked;
    return index >= 0;
  }
}
