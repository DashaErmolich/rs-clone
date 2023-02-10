import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ITrackResponse } from '../../models/api-response.models';
import { DeezerRestApiService } from '../../services/deezer-api.service';

@Injectable({
  providedIn: 'root',
})

export class StateService {
  trackList = new Subject<Partial<ITrackResponse>[]>();

  playingTrackIndex = new Subject<number>();

  trackList$ = this.trackList.asObservable();

  playingTrackIndex$ = this.playingTrackIndex.asObservable();

  constructor(
    private deezerRestApi: DeezerRestApiService,
  ) {
    // temporary data for player testing
    this.deezerRestApi.getSearch('metallica', 0, 6).subscribe((response) => {
      this.trackList.next(response.data);
      this.playingTrackIndex.next(0);
    });
  }

  setTrackList(tracks: Partial<ITrackResponse>[]) {
    this.trackList.next(tracks);
  }

  setPlayingTrackIndex(index: number) {
    this.playingTrackIndex.next(index);
  }
}
