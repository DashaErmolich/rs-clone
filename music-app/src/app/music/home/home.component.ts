import * as moment from 'moment';
import { Component, OnInit } from '@angular/core';
import { AudioService } from '../../core/services/audio.service';
import { StateService } from '../../core/services/state.service';
import { ITrackResponse } from '../../models/api-response.models';
import { DeezerRestApiService } from '../../services/deezer-api.service';
import { IGreetings } from '../../models/greeting.models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  trackList!: Partial<ITrackResponse>[];

  greetings: IGreetings[] = [
    { message: 'home.greeting.morning', hoursStart: 4, hoursEnd: 12 },
    { message: 'home.greeting.afternoon', hoursStart: 12, hoursEnd: 17 },
    { message: 'home.greeting.evening', hoursStart: 17, hoursEnd: 21 },
    { message: 'home.greeting.night', hoursStart: 21, hoursEnd: 4 },
  ];

  constructor(
    private myAudio: AudioService,
    private myState: StateService,
    private deezerApi: DeezerRestApiService,
  ) { }

  ngOnInit(): void {
    // temporary data for player testing
    // you can remove it after first load (it will be saved in the local storage)
    this.deezerApi.getSearch('queen', 0, 25).subscribe((response) => {
      this.trackList = response.data;
      this.myState.trackList$.next(response.data);
    });
    this.myState.trackList$.subscribe((data) => {
      this.trackList = data;
    });
  }

  playTrack(url: string | undefined) {
    if (url) {
      this.myAudio.playTrack(url);
    }
  }

  setTrackIndex(i: number) {
    this.myState.setPlayingTrackIndex(i);
  }

  // eslint-disable-next-line class-methods-use-this
  getCurrentTimeHours() {
    return moment().hours();
  }

  isTrackList(): boolean {
    return Boolean(this.trackList.length);
  }
}
