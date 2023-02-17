import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ITrackResponse } from '../models/api-response.models';
import { LocalStorageService } from './local-storage.service';
import IUserData from '../models/user-data.models';
import { ITrackListInfo } from '../models/audio-player.models';

@Injectable({
  providedIn: 'root',
})

export class StateService {
  trackList$ = new BehaviorSubject<Partial<ITrackResponse>[]>([]);

  playingTrackIndex$ = new BehaviorSubject<number | null>(null);

  isEqualizerShown$ = new BehaviorSubject<boolean>(false);

  userName$ = new BehaviorSubject<string>('Jake');

  userIconId$ = new BehaviorSubject<number>(0);

  constructor(
    private storage: LocalStorageService,
  ) {
    const trackListInfo: ITrackListInfo | null = this.storage.getTrackListInfo();
    const userData: IUserData | null = this.storage.getUserData();

    if (trackListInfo !== null) {
      this.setTrackListInfo(trackListInfo.trackList, trackListInfo.currentTrackIndex);
    }

    if (userData !== null) {
      this.setUserData(userData.userName, userData.userIconId);
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

  setEqualizerVisibility(isVisible: boolean): void {
    this.isEqualizerShown$.next(isVisible);
  }

  setUserData(userName: string, userIconId: number) {
    this.userName$.next(userName);
    this.userIconId$.next(userIconId);
    this.storage.setUserData(userName, userIconId);
  }
}
