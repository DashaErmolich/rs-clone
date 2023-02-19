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

  loading: boolean = true;

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

  description!: string;

  artistImg!: string;

  artistName!: string;

  albumRelease!: string;

  artistId!: number;

  isLiked!: boolean;

  likedSearchResults!: ILikedSearchResults;

  likedSearchResults$!: Subscription;

  constructor(
    private myState: StateService,
    private myAudio: AudioService,
    private deezerRestApiService: DeezerRestApiService,
    private route: ActivatedRoute,
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
  }

  ngOnDestroy(): void {
    if (this.trackList$) this.trackList$.unsubscribe();
    if (this.isPause$) this.isPause$.unsubscribe();
    if (this.isPlay$) this.isPlay$.unsubscribe();
    if (this.routeParams$) this.routeParams$.unsubscribe();
    if (this.result$) this.result$.unsubscribe();
    if (this.likedSearchResults$) this.likedSearchResults$.unsubscribe();
  }

  getArtist(id: number) {
    this.result$ = this.deezerRestApiService
      .getArtist(id)
      .subscribe((res) => {
        this.result = res;
        this.type = res.type as LikedSearchResults;
        this.imgSrc = res.picture_medium ? res.picture_medium : DEFAULT_SRC;
        this.title = res.name;
        this.description = `Albums:  ${res.nb_album},  ${res.nb_fan}  - fans`;
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
        this.imgSrc = res.picture_medium ? res.picture_medium : DEFAULT_SRC;
        this.title = res.title;
        this.tracks = res.tracks.data;
        this.description = `Creator: ${res.creator.name}, ${res.nb_tracks} - songs`;
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
