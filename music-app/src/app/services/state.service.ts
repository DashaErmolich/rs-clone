import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { IUserModel } from 'src/app/models/userModel.models';
import { AuthorizationApiService } from 'src/app/services/authorization-api.service';
import { ITrackResponse } from '../models/api-response.models';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})

export class StateService {
  trackList$ = new BehaviorSubject<Partial<ITrackResponse>[]>([]);

  playingTrackIndex$ = new BehaviorSubject<number | null>(null);

  isEqualizerShown$ = new BehaviorSubject<boolean>(false);

  user = {} as IUserModel;
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

  setUser(user: IUserModel) {
    this.user = user; 
  }
  
  setEqualizerVisibility(isVisible: boolean): void {
    this.isEqualizerShown$.next(isVisible);
  }
}

