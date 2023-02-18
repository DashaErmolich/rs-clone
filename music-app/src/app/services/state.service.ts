import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ITrackResponse } from '../models/api-response.models';
import { ILikedSearchResults, LikedSearchResults } from '../models/search.models';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})

export class StateService {
  trackList$ = new BehaviorSubject<Partial<ITrackResponse>[]>([]);

  playingTrackIndex$ = new BehaviorSubject<number | null>(null);

  isEqualizerShown$ = new BehaviorSubject<boolean>(false);

  searchValue$ = new BehaviorSubject<string>('');

  likedTracks$ = new BehaviorSubject<number[]>([]);

  likedSearchResults$ = new BehaviorSubject<ILikedSearchResults>({
    album: [],
    artist: [],
    playlist: [],
  });

  constructor(private storage: LocalStorageService) {
    const trackListInfo = this.storage.getTrackListInfo();
    if (trackListInfo !== null) {
      this.setTrackListInfo(trackListInfo.trackList, trackListInfo.currentTrackIndex);
    }
    this.likedTracks$.next(this.storage.getLikedTracks());
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

  setLikedSearchResult(type: LikedSearchResults, id: number) {
    this.storage.setLikedSearchResult(type, id);
    this.likedSearchResults$.next(this.storage.getLikedSearchResults());
  }

  removeLikedSearchResult(type: LikedSearchResults, id: number) {
    const likedSearchResults = this.storage.getLikedSearchResults();
    // console.log(likedSearchResults);
    // const searchResultIndex = likedSearchResults[type].findIndex((searchResultId) => {
    //   searchResultId === id;
    // });
    // let searchResultIndex: number;
    // if (type === 'album') {
    const searchResultIndex = likedSearchResults[type]
      .findIndex((searchResultId) => searchResultId === id);
    if (searchResultIndex >= 0) {
      likedSearchResults[type].splice(searchResultIndex, 1);
    }
    // }
    // if (type === 'artists') {
    //   searchResultIndex = likedSearchResults.artists
    //     .findIndex((searchResultId) => searchResultId === id);
    //   if (searchResultIndex >= 0) {
    //     likedSearchResults.artists.splice(searchResultIndex, 1);
    //   }
    // }
    // if (type === 'playlist') {
    //   searchResultIndex = likedSearchResults.playlists
    //     .findIndex((searchResultId) => searchResultId === id);
    //   if (searchResultIndex >= 0) {
    //     likedSearchResults.playlists.splice(searchResultIndex, 1);
    //   }
    // }
    this.storage.setLikedSearchResults(likedSearchResults);
    this.likedSearchResults$.next(likedSearchResults);
  }
}
