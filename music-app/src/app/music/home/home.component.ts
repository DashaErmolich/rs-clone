import * as moment from 'moment';

import { OnInit, Component } from '@angular/core';

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

  constructor(
    private myDeezer: DeezerRestApiService,
    private myUtils: UtilsService,
  ) { }

  ngOnInit(): void {
    this.myDeezer.getSearch('muse', 0, 5).subscribe((response) => {
      this.trackList = this.getReadyData(response.data);
    });
    this.myDeezer.getSearchArtists('met', 0, 5).subscribe((response) => {
      this.artists = this.getReadyData(response.data);
    });
    this.myDeezer.getSearchPlayLists('bla', 0, 5).subscribe((response) => {
      this.playlists = this.getReadyData(response.data);
    });
    this.myDeezer.getGenres().subscribe((response) => {
      this.genres = this.getReadyData(response.data);
    });
    this.myDeezer.getChart().subscribe((response) => {
      this.chartRecommendations.tracks.data = this.getReadyData(response.tracks.data, 10);
      this.chartRecommendations.albums.data = this.getReadyData(response.albums.data);
      this.chartRecommendations.artists.data = this.getReadyData(response.artists.data);
      this.chartRecommendations.playlists.data = this.getReadyData(response.playlists.data);
      this.chartRecommendations.podcasts.data = this.getReadyData(response.podcasts.data);
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
    return this.myUtils.getShuffledArray(data).slice(0, itemsQty);
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
