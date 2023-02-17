import { Injectable, Input, OnChanges } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { userModel } from 'src/app/models/userDto.models';
import { AuthorizationApiService } from 'src/app/services/authorization-api.service';
import { ITrackResponse } from '../../models/api-response.models';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})

export class StateService {
  trackList$ = new BehaviorSubject<Partial<ITrackResponse>[]>([]);

  playingTrackIndex$ = new BehaviorSubject<number | null>(0);

  user = {} as userModel;
  isAuthorized = false;

  constructor(private storage: LocalStorageService, private authService: AuthorizationApiService) {
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

  setAuthorized(authStatus: boolean) {
    this.isAuthorized = authStatus;
  }

  setUser(user: userModel) {
    this.user = user;
  }
}

