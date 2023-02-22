import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { ICategoriesData } from '../../../models/home.models';
import {
  ITrackResponse, IArtistResponse, IPlayListResponse, IAlbumResponse,
} from '../../../models/api-response.models';
import { DeezerRestApiService } from '../../../services/deezer-api.service';
import { StateService } from '../../../services/state.service';
import { ResponsiveService } from '../../../services/responsive.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
})
export class LibraryComponent implements OnInit, OnDestroy {
  favoritesCategories: ICategoriesData = {
    tracks: {
      title: 'library.tracks',
      data: [],
    },
    albums: {
      title: 'library.albums',
      data: [],
    },
    artists: {
      title: 'library.artists',
      data: [],
    },
    playlists: {
      title: 'library.playlists',
      data: [],
    },
    podcasts: {
      title: 'library.podcasts',
      data: [],
    },
  };

  tracks!: Partial<ITrackResponse>[];

  artists!: Partial<IArtistResponse>[];

  playlists!: Partial<IPlayListResponse>[];

  albums!: Partial<IAlbumResponse>[];

  tracksSubscription: Subscription = new Subscription();

  artistsSubscription: Subscription = new Subscription();

  playlistsSubscription: Subscription = new Subscription();

  albumsSubscription: Subscription = new Subscription();

  LikedSearchResultsSubscription: Subscription = new Subscription();

  subscriptions: Subscription[] = [];

  isSmall = false;

  isHandset = false;

  isExtraSmall = false;

  isSmall$ = new Subscription();

  isHandset$ = new Subscription();

  isExtraSmall$ = new Subscription();

  constructor(
    private myDeezer: DeezerRestApiService,
    private myState: StateService,
    private responsive: ResponsiveService,
  ) { }

  ngOnInit(): void {
    this.LikedSearchResultsSubscription = this.myState.likedSearchResults$.subscribe((response) => {
      this.tracks = [];
      this.artists = [];
      this.playlists = [];
      this.albums = [];
      response.album.forEach((albumId) => {
        this.albumsSubscription = this.myDeezer.getAlbum(albumId).subscribe((res) => {
          this.albums.push(res);
        });
      });
      response.artist.forEach((artistId) => {
        this.artistsSubscription = this.myDeezer.getArtist(artistId).subscribe((res) => {
          this.artists.push(res);
        });
      });
      response.playlist.forEach((playlistId) => {
        this.playlistsSubscription = this.myDeezer.getPlayListTracks(playlistId)
          .subscribe((res) => {
            this.playlists.push(res);
          });
      });
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
    this.subscriptions.push(this.isSmall$);
    this.subscriptions.push(this.isHandset$);
    this.subscriptions.push(this.isExtraSmall$);
    this.subscriptions.push(this.LikedSearchResultsSubscription);
    this.subscriptions.push(this.albumsSubscription);
    this.subscriptions.push(this.playlistsSubscription);
    this.subscriptions.push(this.artistsSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
