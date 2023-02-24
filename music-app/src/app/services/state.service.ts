import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { IUserModel } from 'src/app/models/userModel.models';
import { AuthorizationApiService } from './authorization-api.service';
import { ITrackResponse } from '../models/api-response.models';
import { ILikedSearchResults, LikedSearchResults } from '../models/search.models';
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

  user = {} as IUserModel | {};
  isAuthorized = false;

  userName$ = new BehaviorSubject<string>('Jake');

  userIconId$ = new BehaviorSubject<number>(0);

  searchValue$ = new BehaviorSubject<string>('');

  likedTracks$ = new BehaviorSubject<number[]>([]);

  likedSearchResults$ = new BehaviorSubject<ILikedSearchResults>({
    album: [],
    artist: [],
    playlist: [],
  });

  isNavigationMenuShown$ = new BehaviorSubject<boolean>(false);

  isSettingsMenuShown$ = new BehaviorSubject<boolean>(false);

  isSearchInputShown$ = new BehaviorSubject<boolean>(false);

  constructor(
    private storage: LocalStorageService,
    private authService: AuthorizationApiService) {
    const trackListInfo: ITrackListInfo | null = this.storage.getTrackListInfo();
    const userData: IUserData | null = this.storage.getUserData();
    this.authService.getUser().subscribe((data) => {
      this.user = data;
      this.isAuthorized = this.user ? true : false;
    })

    if (trackListInfo !== null) {
      this.setTrackListInfo(trackListInfo.trackList, trackListInfo.currentTrackIndex);
    }

    if (userData !== null) {
      this.setUserData(userData.userName, userData.userIconId);
    }
    this.likedTracks$.next(this.storage.getLikedTracks());
    this.likedSearchResults$.next(this.storage.getLikedSearchResults());
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

  setUserData(userName: string, userIconId: number) {
    this.userName$.next(userName);
    this.userIconId$.next(userIconId);
    this.storage.setUserData(userName, userIconId);
  }

  setSearchParam(searchValue: string) {
    this.searchValue$.next(searchValue);
  }

  setLikedTrack(trackDeezerId: number): void {
    this.storage.setLikedTrack(trackDeezerId);
    this.likedTracks$.next(this.storage.getLikedTracks());
  }

  removeLikedTrack(trackDeezerId: number): void {
    const likedTracks = this.storage.getLikedTracks();
    const trackIndex = likedTracks.findIndex((trackId) => trackId === trackDeezerId);
    if (trackIndex >= 0) {
      likedTracks.splice(trackIndex, 1);
    }
    this.storage.setLikedTracks(likedTracks);
    this.likedTracks$.next(likedTracks);
  }

  setNavigationMenuVisibility(isVisible: boolean): void {
    this.isNavigationMenuShown$.next(isVisible);
  }

  setSettingsMenuVisibility(isVisible: boolean): void {
    this.isSettingsMenuShown$.next(isVisible);
  }

  setSearchInputVisibility(isVisible: boolean): void {
    this.isSearchInputShown$.next(isVisible);
  }

  setLikedSearchResult(type: LikedSearchResults, id: number): void {
    this.storage.setLikedSearchResult(type, id);
    this.likedSearchResults$.next(this.storage.getLikedSearchResults());
  }

  removeLikedSearchResult(type: LikedSearchResults, id: number): void {
    const likedSearchResults = this.storage.getLikedSearchResults();
    const searchResultIndex = likedSearchResults[type]
      .findIndex((searchResultId) => searchResultId === id);
    if (searchResultIndex >= 0) {
      likedSearchResults[type].splice(searchResultIndex, 1);
    }
    this.storage.setLikedSearchResults(likedSearchResults);
    this.likedSearchResults$.next(this.storage.getLikedSearchResults());
  }

  // accChanger() {
  //   const updatedUser: IUserModel = Object.assign({}, this.user);

  //   updatedUser.userFavorites.tracks.push(...this.likedTracks$.value)
    
  //   this.setUser(updatedUser);
  // }
}

