import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IUserModel } from 'src/app/models/user-model.models';
import { AuthorizationApiService } from './authorization-api.service';
import { ITrackResponse } from '../models/api-response.models';
import { ILikedSearchResults, LikedSearchResults } from '../models/search.models';
import { LocalStorageService } from './local-storage.service';
import { ITrackListInfo } from '../models/audio-player.models';
import { UtilsService } from './utils.service';
import { ICustomPlaylistModel } from '../models/user-model.models';
import { AudioService } from './audio.service';

@Injectable({
  providedIn: 'root',
})

export class StateService {
  trackList$ = new BehaviorSubject<Partial<ITrackResponse>[]>([]);

  playingTrackIndex$ = new BehaviorSubject<number | null>(null);

  isEqualizerShown$ = new BehaviorSubject<boolean>(false);

  user!: IUserModel;

  isAuthorized = false;

  userName$ = new BehaviorSubject<string>('');

  userIconId$ = new BehaviorSubject<number>(11);

  searchValue$ = new BehaviorSubject<string>('');

  likedTracks$ = new BehaviorSubject<number[]>([]);

  likedSearchResults$ = new BehaviorSubject<ILikedSearchResults>({
    album: [],
    artist: [],
    playlist: [],
    radio: [],
  });

  isNavigationMenuShown$ = new BehaviorSubject<boolean>(false);

  isSettingsMenuShown$ = new BehaviorSubject<boolean>(false);

  isSearchInputShown$ = new BehaviorSubject<boolean>(false);

  isCurrentTrackListShown$ = new BehaviorSubject<boolean>(false);

  customPlaylists$ = new BehaviorSubject<ICustomPlaylistModel[]>([]);

  isSame$ = new BehaviorSubject<boolean>(false);

  constructor(
    private storage: LocalStorageService,
    private authService: AuthorizationApiService,
    private myUtils: UtilsService,
    private myAudio: AudioService,
  ) {
    const trackListInfo: ITrackListInfo | null = this.storage.getTrackListInfo();
    this.updateState();

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

  setUserToState(user: IUserModel) {
    this.user = user;
  }

  setEqualizerVisibility(isVisible: boolean): void {
    this.isEqualizerShown$.next(isVisible);
  }

  setUserData(userName: string, userIconId: number, isUserUpdateNeeded: boolean = true) {
    this.userName$.next(userName);
    this.userIconId$.next(userIconId);
    if (isUserUpdateNeeded) {
      this.updateUserData();
    }
  }

  setSearchParam(searchValue: string) {
    this.searchValue$.next(searchValue);
  }

  setLikedTrack(trackDeezerId: number): void {
    const likedTracks = this.likedTracks$.value;
    likedTracks.push(trackDeezerId);
    this.likedTracks$.next(likedTracks);
    this.updateUserData();
  }

  removeLikedTrack(trackDeezerId: number): void {
    const likedTracks = this.likedTracks$.value;
    const trackIndex = likedTracks.findIndex((trackId) => trackId === trackDeezerId);
    if (trackIndex >= 0) {
      likedTracks.splice(trackIndex, 1);
    }
    this.likedTracks$.next(likedTracks);
    this.updateUserData();
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
    const likedSearchResults = this.likedSearchResults$.value;
    likedSearchResults[type].push(id);
    this.likedSearchResults$.next(likedSearchResults);
    this.updateUserData();
  }

  removeLikedSearchResult(type: LikedSearchResults, id: number): void {
    const likedSearchResults = this.likedSearchResults$.value;
    const searchResultIndex = likedSearchResults[type]
      .findIndex((searchResultId) => searchResultId === id);

    if (searchResultIndex >= 0) {
      likedSearchResults[type].splice(searchResultIndex, 1);
    }
    this.likedSearchResults$.next(likedSearchResults);
    this.updateUserData();
  }

  updateUserData(): void {
    const updatedUser: IUserModel = { ...this.user };
    updatedUser.username = this.userName$.value;
    updatedUser.userIconId = this.userIconId$.value;
    updatedUser.userFavorites = {
      tracks: this.likedTracks$.value,
      albums: this.likedSearchResults$.value.album,
      artists: this.likedSearchResults$.value.artist,
      playlists: this.likedSearchResults$.value.playlist,
      radio: this.likedSearchResults$.value.radio,
    };
    updatedUser.customPlaylists = this.customPlaylists$.value;
    this.authService.setUser(updatedUser).subscribe((res) => {
      this.user = res;
    });
  }

  setUserDataFromService(userData: IUserModel): void {
    this.setUserData(userData.username, userData.userIconId, false);
    this.likedTracks$.next(userData.userFavorites.tracks);
    this.likedSearchResults$.next({
      album: userData.userFavorites.albums,
      artist: userData.userFavorites.artists,
      playlist: userData.userFavorites.playlists,
      radio: userData.userFavorites.radio,
    });
    this.customPlaylists$.next(userData.customPlaylists);
  }

  updateState() {
    this.authService.getUser().subscribe((data) => {
      if (!this.myUtils.isEmptyObject(data)) {
        this.user = data as IUserModel;
        this.isAuthorized = true;
        this.setUserDataFromService(this.user);
      }
    });
  }

  setCurrentTrackListVisibility(isVisible: boolean) {
    this.isCurrentTrackListShown$.next(isVisible);
  }

  setCustomPlaylist(playlist: ICustomPlaylistModel) {
    const customPlaylists: ICustomPlaylistModel[] = this.customPlaylists$.value;
    customPlaylists.push(playlist);
    this.customPlaylists$.next(customPlaylists);
    this.updateUserData();
  }

  deleteCustomPlaylist(playlistId: string) {
    const customPlaylists: ICustomPlaylistModel[] = this.customPlaylists$.value;
    const searchResultIndex = customPlaylists
      .findIndex((searchResultId) => searchResultId.id === playlistId);

    if (searchResultIndex >= 0) {
      customPlaylists.splice(searchResultIndex, 1);
    }
    this.customPlaylists$.next(customPlaylists);
    this.updateUserData();
  }

  resetPlayingTrackList() {
    this.trackList$.next([]);
    this.playingTrackIndex$.next(null);
    this.myAudio.resetState();
  }
}
