import * as moment from 'moment';

import { OnInit, Component } from '@angular/core';

import { forkJoin } from 'rxjs';

import {
  ITrackResponse,
  IArtistResponse,
  IPlayListResponse,
  IGenreResponse,
  IAlbumResponse,
} from '../../models/api-response.models';

import { DeezerRestApiService } from '../../services/deezer-api.service';
import { IGreetings } from '../../models/greeting.models';
import { IChartRecommendations } from '../../models/home.models';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  itemsQtyDefault = 5;

  trackList!: Partial<ITrackResponse>[];

  artists!: Partial<IArtistResponse>[];

  playlists!: Partial<IPlayListResponse>[];

  genres!: Partial<IGenreResponse>[];

  playlistsFromChart!: Partial<IPlayListResponse>[];

  albumsFromChart!: Partial<IAlbumResponse>[];

  artistsFromChart!: Partial<IArtistResponse>[];

  chartRecommendations: IChartRecommendations = {
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

  constructor(
    private myDeezer: DeezerRestApiService,
    private myUtils: UtilsService,
  ) { }

  ngOnInit(): void {
    forkJoin({
      genres: this.myDeezer.getGenres(),
      chartData: this.myDeezer.getChart(),
    }).subscribe((response) => {
      this.genres = this.getReadyData(response.genres.data);
      this.chartRecommendations.tracks.data = this.getReadyData(response.chartData.tracks.data, 10);
      this.chartRecommendations.albums.data = this.getReadyData(response.chartData.albums.data);
      this.chartRecommendations.artists.data = this.getReadyData(response.chartData.artists.data);
      this.chartRecommendations.playlists.data = this.getReadyData(
        response.chartData.playlists.data,
      );
      this.chartRecommendations.podcasts.data = this.getReadyData(response.chartData.podcasts.data);
      this.isLoading = false;
    });
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

    if (hours < 21) {
      result = hours >= hoursStart && hours < hoursEnd;
    } else {
      result = hoursStart === this.greetings[this.greetings.length - 1].hoursStart
        && hoursEnd === this.greetings[this.greetings.length - 1].hoursEnd;
    }
    return result;
  }
}
