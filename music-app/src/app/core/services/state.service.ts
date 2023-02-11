import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ITrackResponse } from '../../models/api-response.models';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})

export class StateService {
  // trackList = new Subject<Partial<ITrackResponse>[]>();

  // playingTrackIndex = new Subject<number>();

  // trackList$ = this.trackList.asObservable();

  // playingTrackIndex$ = this.playingTrackIndex.asObservable();

  trackList$ = new BehaviorSubject<Partial<ITrackResponse>[]>([]);

  playingTrackIndex$ = new BehaviorSubject<number | null>(0);

  constructor(private storage: LocalStorageService) {
    const trackListInfo = this.storage.getTrackListInfo();
    if (trackListInfo !== null) {
      this.setTrackListInfo(trackListInfo.trackList, trackListInfo.currentTrackIndex);
    }
  }

  setTrackListInfo(tracks: Partial<ITrackResponse>[], index: number) {
    this.trackList$.next(tracks);
    this.playingTrackIndex$.next(index);
    this.storage.setTrackListInfo(tracks, index);
  }

  setPlayingTrackIndex(index: number) {
    this.playingTrackIndex$.next(index);
    this.storage.setTrackListInfo(this.trackList$.value, index);
  }
}
