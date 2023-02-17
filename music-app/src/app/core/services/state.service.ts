import { Injectable, Input, OnChanges } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { userModel } from 'src/app/models/userDto.models';
import { AuthorizationApiService } from 'src/app/services/authorization-api.service';
import { ITrackResponse } from '../../models/api-response.models';
import { LocalStorageService } from './local-storage.service';
import { take, catchError } from 'rxjs/operators';

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

  login(username: string, email: string, password: string) {
    try {
      this.authService.login(username, email, password).pipe(take(1)).subscribe((res) => {
        console.log('Login at state reached! Response:')
        console.log(res); // ПОЧИСТИТЬ ЛОГИ
        localStorage.setItem('token', res.accessToken)
        this.setAuthorized(true);
        this.setUser(res.user)
      })
    } catch (e) {
      console.error('Cached error at store/login:');
      console.error(e)
    }
  }

  registration(username: string, email: string, password: string) {
    try {
      this.authService.registration(username, email, password).pipe(take(1)).subscribe((res) => {
        console.log('Registration at state reached! Response:')
        console.log(res); // ПОЧИСТИТЬ ЛОГИ
        localStorage.setItem('token', res.accessToken)
        this.setAuthorized(true);
        this.setUser(res.user)
      })
    } catch (e) {
      console.error('Cached error at store/registration:');
      console.error(e)
    }
  }

  logout() {
    try {
      this.authService.logout().pipe(take(1)).subscribe(() => {
        localStorage.removeItem('token')
        this.setAuthorized(false);
        this.setUser({} as userModel)
        console.log('Logged out!')
      })
    } catch (e) {
      console.error('Cached error at store/logout:');
      console.error(e)
    }
  }
  
  checkAuth() {
    try {
      this.authService.refresh().pipe(take(1)).subscribe((res) => {
        console.log('Authorization is checking now! Response:')
        console.log(res); // ПОЧИСТИТЬ ЛОГИ
        if (res.accessToken) {
          localStorage.setItem('token', res.accessToken)
          console.log(this.isAuthorized)
          this.setAuthorized(true);
          this.setUser(res.user)
          console.log(this.isAuthorized)
        }
      })
    } catch (e) {
      console.error('Cached error at store/checkAuth:');
      console.error(e)
    }
  }

  fetch() {
      this.authService.fetchUsers().pipe(
      take(1),  
      catchError(err => {
        if (err.status === 403) {
          console.log('Refresh required error handled at fetch(). Token refreshed. Attempt to fetch() again');
          setTimeout(() => {
            this.fetch();
          }, 500)
        }
        return [];
    })).subscribe((res) => {
        console.log(res)
      })
  }
}

