import { Component, OnInit } from '@angular/core';
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
import { delay } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
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

  loading = false;

  searchParam: string = '';

  length: number | undefined;

  tracks: Partial<ITrackResponse>[] = [];

  artists: Partial<IArtistResponse>[] = [];

  albums: Partial<IAlbumResponse>[] = [];

  playlists: Partial<IPlayListResponse>[] = [];

  isSelected: boolean = true;

  constructor(
    private deezerRestApiService: DeezerRestApiService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((param) => {
      this.searchParam = param['q'];
      if (this.searchParam) {
        this.renderTracks();
      } else {
        this.loading = true;
        this.deezerRestApiService.getChart().subscribe((playlists) => {
          this.playlistsFromChart = playlists.playlists.data;
          this.loading = false;
        });
        this.deezerRestApiService.getGenres().subscribe((genres) => {
          this.genres = genres.data.filter((genre) => genre.id !== 0);
        });
      }
    });
  }

  renderTracks() {
    this.route.queryParams.subscribe((param) => {
      this.searchParam = param['q'];
      if (!this.tracks.length) this.loading = true;
      this.deezerRestApiService
        .getSearch(this.searchParam, this.index, this.limitTracks)
        .pipe(delay(2000))
        .subscribe((res) => {
          this.tracks = res.data;
          this.loading = false;
        });
    });
  }

  renderArtists() {
    this.route.queryParams.subscribe((param) => {
      this.searchParam = param['q'];
      if (!this.artists.length) this.loading = true;
      this.deezerRestApiService
        .getSearchArtists(this.searchParam, this.index, this.limitArtists)
        .pipe(delay(2000))
        .subscribe((res) => {
          this.artists = res.data;
          this.loading = false;
        });
    });
  }

  renderAlbums() {
    this.route.queryParams.subscribe((param) => {
      this.searchParam = param['q'];
      if (!this.albums.length) this.loading = true;
      this.deezerRestApiService
        .getSearchAlbums(this.searchParam, this.index, this.limitAlbums)
        .pipe(delay(2000))
        .subscribe((res) => {
          this.albums = res.data;
          this.loading = false;
        });
    });
  }

  renderPlaylists() {
    this.route.queryParams.subscribe((param) => {
      this.searchParam = param['q'];
      if (!this.playlists.length) this.loading = true;
      this.deezerRestApiService
        .getSearchPlayLists(this.searchParam, this.index, this.limitPlaylists)
        .pipe(delay(2000))
        .subscribe((res) => {
          this.playlists = res.data;
          this.loading = false;
        });
    });
  }

  getMore(searchType: string) {
    if (searchType === SearchType.playlists) {
      this.limitPlaylists += 10;
      this.renderPlaylists();
    }
    if (searchType === SearchType.tracks) {
      this.limitTracks += 25;
      this.renderTracks();
    }
    if (searchType === SearchType.albums) {
      this.limitAlbums += 10;
      this.renderAlbums();
    }
    if (searchType === SearchType.artists) {
      this.limitArtists += 10;
      this.renderArtists();
    }
  }

  randomColor(i: number) {
    const index = i % this.colors.length;
    return this.colors[index];
  }

  checkTypeOfSearch(typeOfSearch: string) {
    if (this.searchType === typeOfSearch) return;
    this.searchType = typeOfSearch;
    if (typeOfSearch === SearchType.playlists) {
      this.renderPlaylists();
    }
    if (typeOfSearch === SearchType.tracks) {
      this.renderTracks();
    }
    if (typeOfSearch === SearchType.albums) {
      this.renderAlbums();
    }
    if (typeOfSearch === SearchType.artists) {
      this.renderArtists();
    }
  }
}
