/* eslint-disable class-methods-use-this */
import { Injectable } from '@angular/core';
import { ITrackResponse } from '../models/api-response.models';
import { IPLayerInfo, ITrackListInfo } from '../models/audio-player.models';
import { IUserTheme } from '../models/theme.models';

@Injectable({
  providedIn: 'root',
})

export class LocalStorageService {
  setLanguage(language: string): void {
    localStorage.setItem('lang', language);
  }

  getLanguage(): string | null {
    return localStorage.getItem('lang');
  }

  setTheme(theme: string, darkness: boolean): void {
    const userTheme: IUserTheme = {
      cssClass: theme,
      isDark: darkness,
    };

    localStorage.setItem('theme', JSON.stringify(userTheme));
  }

  getTheme(): IUserTheme | null {
    const userTheme = localStorage.getItem('theme');
    return userTheme === null ? null : JSON.parse(userTheme);
  }

  setTrackListInfo(
    userTrackList: Partial<ITrackResponse>[],
    userCurrentTrackIndex: number,
  ): void {
    const trackListInfo: ITrackListInfo = {
      trackList: userTrackList,
      currentTrackIndex: userCurrentTrackIndex,
    };

    localStorage.setItem('trackList', JSON.stringify(trackListInfo));
  }

  getTrackListInfo(): ITrackListInfo | null {
    const trackListInfo = localStorage.getItem('trackList');
    return trackListInfo === null ? null : JSON.parse(trackListInfo);
  }

  setPlayerVolume(volume: number) {
    localStorage.setItem('volume', String(volume));
  }

  getPlayerVolume(): number | null {
    const volume = localStorage.getItem('volume');
    return volume === null ? null : Number(volume);
  }

  setPlayerInfo(
    userIsRepeatAllOn: boolean,
    userIsRepeatOneOn: boolean,
  ): void {
    const playerInfo: IPLayerInfo = {
      isRepeatAllOn: userIsRepeatAllOn,
      isRepeatOneOn: userIsRepeatOneOn,
    };
    localStorage.setItem('player', JSON.stringify(playerInfo));
  }

  getPlayerInfo(): IPLayerInfo | null {
    const playerInfo = localStorage.getItem('player');
    return playerInfo === null ? null : JSON.parse(playerInfo);
  }

  // setCurrentPlayingTrackIndex(currentTrackIndex: number) {
  //   localStorage.setItem('currentTrackIndex', JSON.stringify(currentTrackIndex));
  // }

  // getCurrentPlayingTrackIndex() {
  //   const currentTrackIndex = localStorage.getItem('currentTrackIndex');
  //   return currentTrackIndex === null ? null : JSON.parse(currentTrackIndex);
  // }
}
