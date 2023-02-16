import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  IGenreResponse,
  IPlayListResponse,
  ITrackResponse,
  IArtistResponse,
  IAlbumResponse,
} from 'src/app/models/api-response.models';
import { DeezerRestApiService } from 'src/app/services/deezer-api.service';
import { DEFAULT_SRC, COLORS } from 'src/app/constants/constants';
import { Limits, SearchType } from 'src/app/enums/endpoints';
import { Observable, Subscription } from 'rxjs';
import { StateService } from 'src/app/services/state.service';
import { AudioService } from 'src/app/services/audio.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
  colors: string[] = COLORS;

  defaultImg: string = DEFAULT_SRC;

  isSearchPage: boolean = true;

  limitTracks: number = Limits.tracks;

  limitArtists: number = Limits.artists;

  limitAlbums: number = Limits.albums;

  limitPlaylists: number = Limits.playlists;

  index: number = 0;

  searchType: string = SearchType.tracks;

  genres: IGenreResponse[] = [];

  playlistsFromChart: Partial<IPlayListResponse>[] = [];

  loading = true;

  searchParam: string = '';

  tracks: Partial<ITrackResponse>[] = [];

  tracksOfState: Partial<ITrackResponse>[] = [];

  artists: Partial<IArtistResponse>[] = [];

  albums: Partial<IAlbumResponse>[] = [];

  playlists: Partial<IPlayListResponse>[] = [];

  queryParams$!: Subscription;

  genres$!: Subscription;

  playlistsFromChart$!: Subscription;

  tracks$!: Subscription;

  artists$!: Subscription;

  albums$!: Subscription;

  playlists$!: Subscription;

  playingTrackIndex$!: Subscription;

  trackList$!: Subscription;

  isPlay$!: Observable<boolean>;

  isPause$!: Observable<boolean>;

  isEnd$!: Subscription;

  playingTrackIndex!: number;

  isPlay!: boolean;

  isEnd!: boolean;

  constructor(
    private deezerRestApiService: DeezerRestApiService,
    private route: ActivatedRoute,
    private state: StateService,
    private myAudio: AudioService,
    private themeService: ThemeService,
  ) {}

  theme: string = this.themeService.activeTheme;

  ngOnInit(): void {
    this.queryParams$ = this.route.queryParams.subscribe((param) => {
      this.searchParam = param['q'];
      if (this.searchParam) {
        this.checkTypeOfSearch();
      } else {
        this.loading = true;
        this.genres$ = this.deezerRestApiService.getGenres().subscribe((genres) => {
          this.genres = genres.data.filter((genre) => genre.id !== 0);
          this.loading = false;
        });
        this.playlistsFromChart$ = this.deezerRestApiService.getChart().subscribe((playlists) => {
          this.playlistsFromChart = playlists.playlists.data;
        });
        this.searchType = SearchType.tracks;
      }
    });
    this.isPlay$ = this.myAudio.isPlay$;
    this.isPause$ = this.myAudio.isPause$;
    this.isEnd$ = this.myAudio.state$.subscribe((res) => {
      if (res.progress !== res.duration) {
        this.isEnd = false;
      } else {
        this.isEnd = true;
      }
    });
    this.trackList$ = this.state.trackList$.subscribe((tracks) => {
      this.tracksOfState = tracks;
    });
    this.playingTrackIndex$ = this.state.playingTrackIndex$.subscribe((index) => {
      this.playingTrackIndex = index!;
    });
  }

  ngOnDestroy(): void {
    if (this.queryParams$) this.queryParams$.unsubscribe();
    if (this.genres$) this.genres$.unsubscribe();
    if (this.playlistsFromChart$) this.playlistsFromChart$.unsubscribe();
    if (this.tracks$) this.tracks$.unsubscribe();
    if (this.artists$) this.artists$.unsubscribe();
    if (this.albums$) this.albums$.unsubscribe();
    if (this.playlists$) this.playlists$.unsubscribe();
    if (this.playingTrackIndex$) this.playingTrackIndex$.unsubscribe();
    if (this.isEnd$) this.isEnd$.unsubscribe();
    if (this.trackList$) this.trackList$.unsubscribe();
  }

  renderTracks() {
    this.searchType = SearchType.tracks;
    this.tracks$ = this.deezerRestApiService
      .getSearch(this.searchParam, this.index, this.limitTracks)
      .subscribe((res) => {
        this.tracks = res.data;
        this.loading = false;
      });
  }

  renderArtists() {
    this.searchType = SearchType.artists;
    if (!this.artists || this.artists.length === 0) this.loading = true;
    this.artists$ = this.deezerRestApiService
      .getSearchArtists(this.searchParam, this.index, this.limitArtists)
      .subscribe((res) => {
        this.artists = res.data;
        this.loading = false;
      });
  }

  renderAlbums() {
    this.searchType = SearchType.albums;
    if (!this.albums || this.albums.length === 0) this.loading = true;
    this.deezerRestApiService
      .getSearchAlbums(this.searchParam, this.index, this.limitAlbums)
      .subscribe((res) => {
        this.albums = res.data;
        this.loading = false;
      });
  }

  renderPlaylists() {
    this.searchType = SearchType.playlists;
    if (!this.playlists || this.playlists.length === 0) this.loading = true;
    this.playlists$ = this.deezerRestApiService
      .getSearchPlayLists(this.searchParam, this.index, this.limitPlaylists)
      .subscribe((res) => {
        this.playlists = res.data;
        this.loading = false;
      });
  }

  getMore(searchType: string) {
    if (searchType === SearchType.playlists) {
      this.limitPlaylists += Limits.playlists;
      this.renderPlaylists();
    }
    if (searchType === SearchType.tracks) {
      this.limitTracks += Limits.tracks;
      this.tracks$ = this.deezerRestApiService
        .getSearch(this.searchParam, this.index, this.limitTracks)
        .subscribe((res) => {
          this.tracks = res.data;
          if (this.tracksOfState.length) {
            this.state.setTrackListInfo(this.tracks, this.playingTrackIndex);
          }
          this.loading = false;
        });
    }
    if (searchType === SearchType.albums) {
      this.limitAlbums += Limits.albums;
      this.renderAlbums();
    }
    if (searchType === SearchType.artists) {
      this.limitArtists += Limits.artists;
      this.renderArtists();
    }
  }

  randomColor(i: number) {
    const index = i % this.colors.length;
    return this.colors[index];
  }

  checkTypeOfSearch() {
    if (this.searchType === SearchType.tracks) {
      this.renderTracks();
    }
    if (this.searchType === SearchType.albums) {
      this.renderAlbums();
    }
    if (this.searchType === SearchType.artists) {
      this.renderArtists();
    }
    if (this.searchType === SearchType.playlists) {
      this.renderPlaylists();
    }
  }

  setTracksInfo(index: number) {
    this.state.setTrackListInfo(this.tracks, index);
    this.myAudio.playTrack(String(this.tracksOfState[index].preview));
    this.isPlay = !this.isPlay;
  }

  playPause() {
    this.myAudio.isPlay$.subscribe((res) => { this.isPlay = res; });
    if (this.isPlay) {
      this.myAudio.pause();
    } else {
      this.myAudio.play();
    }
  }

  isTrackPlaying(index: number) {
    return this.tracksOfState.length
      ? this.tracks[index].id === this.tracksOfState[this.playingTrackIndex].id : false;
  }
}
