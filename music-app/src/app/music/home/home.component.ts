import { Component, OnInit } from '@angular/core';
import { AudioService } from '../../core/services/audio.service';
import { StateService } from '../../core/services/state.service';
import { ITrackResponse } from '../../models/api-response.models';
import { DeezerRestApiService } from '../../services/deezer-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  trackList!: Partial<ITrackResponse>[];

  constructor(
    private myAudio: AudioService,
    private myState: StateService,
    private deezerApi: DeezerRestApiService,
  ) { }

  ngOnInit(): void {
    // temporary data for player testing
    // you can remove it after first load (it will be saved in the local storage)
    this.deezerApi.getSearch('queen', 0, 5).subscribe((response) => {
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
}
