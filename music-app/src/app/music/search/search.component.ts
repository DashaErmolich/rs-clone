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

  loading = false;

  searchParam: string = '';

  length: number | undefined;

  tracks: Partial<ITrackResponse>[] = [];

  artists: Partial<IArtistResponse>[] = [];

  albums: Partial<IAlbumResponse>[] = [];

  playlists: Partial<IPlayListResponse>[] = [];

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
        this.deezerRestApiService.getChart().subscribe((playLists) => {
          this.playlists = playLists.playlists.data;
          this.loading = false;
        });
        this.deezerRestApiService.getGenres().subscribe((genres) => {
          this.genres = genres.data.filter((genre) => genre.id !== 0);
        });
      }
    });
  }

  renderTracks() {
    this.searchType = SearchType.tracks;
    this.route.queryParams.subscribe((param) => {
      this.searchParam = param['q'];
      this.deezerRestApiService
        .getSearch(this.searchParam, this.index, this.limitTracks)
        .subscribe((res) => { this.tracks = res.data; });
    });
  }

  renderArtists() {
    this.searchType = SearchType.artists;
    this.route.queryParams.subscribe((param) => {
      this.searchParam = param['q'];
      this.deezerRestApiService
        .getSearchArtists(this.searchParam, this.index, this.limitArtists)
        .subscribe((res) => { this.artists = res.data; });
    });
  }

  renderAlbums() {
    this.searchType = SearchType.albums;
    this.route.queryParams.subscribe((param) => {
      this.searchParam = param['q'];
      this.deezerRestApiService
        .getSearchAlbums(this.searchParam, this.index, this.limitAlbums)
        .subscribe((res) => { this.albums = res.data; });
    });
  }

  renderPlaylists() {
    this.searchType = SearchType.playlists;
    this.route.queryParams.subscribe((param) => {
      this.searchParam = param['q'];
      this.deezerRestApiService
        .getSearchPlayLists(this.searchParam, this.index, this.limitPlaylists)
        .subscribe((res) => { this.playlists = res.data; });
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
}
