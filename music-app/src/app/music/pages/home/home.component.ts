import * as moment from 'moment';

import { OnInit, Component, OnDestroy } from '@angular/core';

import { forkJoin, Subscription } from 'rxjs';

import {
  ITrackResponse,
  IArtistResponse,
  IPlayListResponse,
  IGenreResponse,
  IAlbumResponse,
} from '../../../models/api-response.models';

import { DeezerRestApiService } from '../../../services/deezer-api.service';
import { IGreetings } from '../../../models/greeting.models';
import { ICategoriesData } from '../../../models/home.models';
import { UtilsService } from '../../../services/utils.service';
import { ResponsiveService } from '../../../services/responsive.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit, OnDestroy {
  itemsQtyDefault = 6;

  trackList!: Partial<ITrackResponse>[];

  artists!: Partial<IArtistResponse>[];

  playlists!: Partial<IPlayListResponse>[];

  genres!: Partial<IGenreResponse>[];

  playlistsFromChart!: Partial<IPlayListResponse>[];

  albumsFromChart!: Partial<IAlbumResponse>[];

  artistsFromChart!: Partial<IArtistResponse>[];

  chartRecommendations: ICategoriesData = {
    tracks: {
      title: 'home.charts.tracks',
      data: [],
    },
    albums: {
      title: 'home.charts.albums',
      data: [],
    },
    artists: {
      title: 'home.charts.artists',
      data: [],
    },
    playlists: {
      title: 'home.charts.playlists',
      data: [],
    },
    podcasts: {
      title: 'home.charts.podcasts',
      data: [],
    },
  };

  greetings: IGreetings[] = [
    { message: 'home.greeting.morning', hoursStart: 4, hoursEnd: 12 },
    { message: 'home.greeting.afternoon', hoursStart: 12, hoursEnd: 17 },
    { message: 'home.greeting.evening', hoursStart: 17, hoursEnd: 21 },
    { message: 'home.greeting.night', hoursStart: 21, hoursEnd: 4 },
  ];

  isLoading = true;

  isSmall = false;

  isHandset = false;

  isExtraSmall = false;

  isSmall$ = new Subscription();

  isHandset$ = new Subscription();

  isExtraSmall$ = new Subscription();

  forkJoinSubscription$ = new Subscription();

  subscriptions: Subscription[] = [];

  constructor(
    private myDeezer: DeezerRestApiService,
    private myUtils: UtilsService,
    private responsive: ResponsiveService,
  ) { }

  ngOnInit(): void {
    this.forkJoinSubscription$ = forkJoin({
      genres: this.myDeezer.getGenres(),
      chartData: this.myDeezer.getChart(),
    }).subscribe((response) => {
      this.genres = this.getReadyData(response.genres.data);
      this.chartRecommendations.tracks.data = response.chartData.tracks.data;
      this.chartRecommendations.albums.data = this.getReadyData(response.chartData.albums.data);
      this.chartRecommendations.artists.data = this.getReadyData(response.chartData.artists.data);
      this.chartRecommendations.playlists.data = this.getReadyData(
        response.chartData.playlists.data,
      );
      this.chartRecommendations.podcasts.data = this.getReadyData(response.chartData.podcasts.data);
      this.isLoading = false;
    });
    this.subscriptions.push(this.forkJoinSubscription$);
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
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  // eslint-disable-next-line class-methods-use-this
  getCurrentTimeHours() {
    return moment().hours();
  }

  isTrackList(): boolean {
    return this.trackList ? Boolean(this.trackList.length) : false;
  }

  getReadyData<T>(data: T[], itemsQty: number = this.itemsQtyDefault): T[] {
    let result: T[] = [];
    if (data.length) {
      result = this.myUtils.getShuffledArray(data);
    }
    if (result.length >= itemsQty) {
      result = result.slice(0, itemsQty);
    }
    return result;
  }

  isThisTimeOfDay(hoursStart: number, hoursEnd: number): boolean {
    const hours = this.getCurrentTimeHours();
    let result = false;

    if (hours >= 4 && hours < 21) {
      result = hours >= hoursStart && hours < hoursEnd;
    } else {
      result = hoursStart === this.greetings[this.greetings.length - 1].hoursStart
        && hoursEnd === this.greetings[this.greetings.length - 1].hoursEnd;
    }
    return result;
  }
}
