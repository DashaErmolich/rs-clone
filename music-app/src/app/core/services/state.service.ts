import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ITrackResponse } from '../../models/api-response.models';

@Injectable({
  providedIn: 'root',
})

export class StateService {
  trackList = new Subject<Partial<ITrackResponse>[]>();

  playingTrackIndex = new Subject<number>();

  trackList$ = this.trackList.asObservable();

  playingTrackIndex$ = this.playingTrackIndex.asObservable();

  setTrackList(tracks: Partial<ITrackResponse>[]) {
    this.trackList.next(tracks);
  }

  setPlayingTrackIndex(index: number) {
    this.playingTrackIndex.next(index);
  }
}
