import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  IGenreResponse,
  IPlayListResponse,
  ITrackResponse,
  IArtistResponse,
  IAlbumResponse,
  IRadioResponse,
} from 'src/app/models/api-response.models';
import { DeezerRestApiService } from 'src/app/services/deezer-api.service';
import { Limits, SearchType } from 'src/app/enums/endpoints';
import { StateService } from 'src/app/services/state.service';
import { ThemeService } from 'src/app/services/theme.service';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { ResponsiveService } from '../../../services/responsive.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
  limitTracks: number = Limits.tracks;

  limitArtists: number = Limits.artists;

  limitAlbums: number = Limits.albums;

  limitPlaylists: number = Limits.playlists;

  index = 0;

  searchType: string = SearchType.tracks;

  genres: IGenreResponse[] = [];

  playlistsFromChart: Partial<IPlayListResponse>[] = [];

  loading = true;

  searchParam = '';

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

  searchParam$!: Subscription;

  playingTrackIndex!: number;

  isSmall = false;

  isHandset = false;

  isExtraSmall = false;

  isSmall$ = new Subscription();

  isHandset$ = new Subscription();

  isExtraSmall$ = new Subscription();

  forkJoinSubscription$ = new Subscription();

  subscriptions: Subscription[] = [];

  radios!: IRadioResponse[];

  radios$!: Subscription;

  constructor(
    private deezerRestApiService: DeezerRestApiService,
    private state: StateService,
    private themeService: ThemeService,
    private responsive: ResponsiveService,
  ) {}

  theme: string = this.themeService.activeTheme;

  ngOnInit(): void {
    this.searchParam$ = this.state.searchValue$
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((res) => {
        this.searchParam = res;
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

          this.radios$ = this.deezerRestApiService.getRadios().subscribe((radios) => {
            this.radios = radios.data;
          });
          this.searchType = SearchType.tracks;
        }
      });
    this.trackList$ = this.state.trackList$.subscribe((tracks) => {
      this.tracksOfState = tracks;
    });
    this.playingTrackIndex$ = this.state.playingTrackIndex$.subscribe((index) => {
      this.playingTrackIndex = index!;
    });
    this.isSmall$ = this.responsive.isSmall$.subscribe((data) => {
      this.isSmall = data;
    });
    this.subscriptions.push(this.isSmall$);
    this.isHandset$ = this.responsive.isHandset$.subscribe((data) => {
      this.isHandset = data;
    });
    this.subscriptions.push(this.isHandset$);
    this.isExtraSmall$ = this.responsive.isExtraSmall$.subscribe((data) => {
      this.isExtraSmall = data;
    });
    this.subscriptions.push(this.isExtraSmall$);
  }

  ngOnDestroy(): void {
    if (this.genres$) this.genres$.unsubscribe();
    if (this.playlistsFromChart$) this.playlistsFromChart$.unsubscribe();
    if (this.tracks$) this.tracks$.unsubscribe();
    if (this.artists$) this.artists$.unsubscribe();
    if (this.albums$) this.albums$.unsubscribe();
    if (this.playlists$) this.playlists$.unsubscribe();
    if (this.playingTrackIndex$) this.playingTrackIndex$.unsubscribe();
    if (this.trackList$) this.trackList$.unsubscribe();
    if (this.searchParam$) this.searchParam$.unsubscribe();
    if (this.radios$) this.radios$.unsubscribe();
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
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

  // renderRadios() {
  //   this.searchType = SearchType.radios;
  //   this.radios$ = this.deezerRestApiService
  //   .getRadios()
  //   .subscribe((res) => {
  //     this.radios = res.data;
  //   })
  // }

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
}
