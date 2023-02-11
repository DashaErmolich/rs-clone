import { Component, OnInit } from '@angular/core';
import { AudioService } from '../../core/services/audio.service';
import { StateService } from '../../core/services/state.service';
import { DeezerRestApiService } from '../../services/deezer-api.service';
import { ITrackResponse } from '../../models/api-response.models';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  trackList!: Partial<ITrackResponse>[];

  constructor(
    private myAudio: AudioService,
    private myState: StateService,
    private deezerApi: DeezerRestApiService,
  ) { }

  ngOnInit(): void {
    // temporary data for player testing
    this.deezerApi.getSearch('Kata Ton Daimona Eaytoy', 0, 6).subscribe((response) => {
      this.trackList = response.data;
      this.myState.trackList.next(response.data);
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
