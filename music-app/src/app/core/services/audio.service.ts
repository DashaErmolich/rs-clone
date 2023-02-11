import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as moment from 'moment';
import { IAudioPlayerState } from '../../models/audio-player.models';

const DEFAULT_PLAYER_VOLUME = 1;

@Injectable({
  providedIn: 'root',
})

export class AudioService {
  defaultState: IAudioPlayerState = {
    progress: 0,
    time: this.getFormattedTime(0),
    durationTime: this.getFormattedTime(0),
    duration: 0,
  };

  currentState: IAudioPlayerState = {
    progress: this.defaultState.progress,
    time: this.defaultState.time,
    durationTime: this.defaultState.durationTime,
    duration: this.defaultState.duration,
  };

  isTrackReady$ = new BehaviorSubject(false);

  isPlay$ = new BehaviorSubject(false);

  isMute$ = new BehaviorSubject(false);

  state$ = new BehaviorSubject(this.defaultState);

  currentVolume = DEFAULT_PLAYER_VOLUME;

  audio = new Audio();

  playTrack(url: string): void {
    this.isTrackReady$.next(false);
    this.state$.next(this.defaultState);
    this.isPlay$.next(true);

    if (url) {
      this.audio.src = url;
      this.audio.load();
      this.bindListeners();
    }
  }

  bindListeners(): void {
    this.audio.addEventListener('loadedmetadata', () => {
      this.isTrackReady$.next(true);
      this.audio.play();
      this.state$.subscribe(() => {
        this.currentState.progress = this.state$.value.progress;
        this.currentState.time = this.state$.value.time;
        this.currentState.durationTime = this.state$.value.durationTime;
        this.currentState.duration = this.state$.value.duration;
      });
    });

    this.audio.addEventListener('timeupdate', () => {
      this.updateProgress();
    });

    this.audio.addEventListener('ended', () => {
      this.isPlay$.next(false);
    });
  }

  updateProgress(): void {
    this.state$.next({
      progress: this.audio.currentTime,
      time: this.getFormattedTime(this.audio.currentTime),
      durationTime: this.getTotalTime(),
      duration: this.audio.duration,
    });
  }

  play(): void {
    this.audio.play();
    this.isPlay$.next(!this.isPlay$.value);
  }

  pause(): void {
    this.audio.pause();
    this.isPlay$.next(!this.isPlay$.value);
  }

  setVolume(volume: number): void {
    this.audio.volume = volume;
    if (this.audio.volume === 0) {
      this.isMute$.next(true);
    } else {
      this.isMute$.next(false);
    }
  }

  setCurrentTime(currentTime: number): void {
    this.audio.currentTime = currentTime;
    this.updateProgress();
  }

  // eslint-disable-next-line class-methods-use-this
  getFormattedTime(sec: number, format: string = 'mm:ss'): string {
    return moment.utc(sec * 1000).format(format);
  }

  getTotalTime(): string {
    const result = this.audio.duration;
    if (!result) {
      return this.getFormattedTime(0);
    }
    return this.getFormattedTime(result);
  }
}
