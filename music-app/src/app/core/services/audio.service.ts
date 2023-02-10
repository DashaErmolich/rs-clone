import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as moment from 'moment';
import { IAudioPlayerState, IPlayerControlsState } from '../../models/audio-player.models';
import { ITrackResponse } from '../../models/api-response.models';
import { StateService } from './state.service';

const DEFAULT_PLAYER_VOLUME = 1;

@Injectable({
  providedIn: 'root',
})

export class AudioService {
  trackList!: Partial<ITrackResponse>[];

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

  controlsState: IPlayerControlsState = {
    isPlay: false,
    isMute: false,
    isRepeatAllOn: false,
    isRepeatOneOn: false,
    isFirstTrack: false,
    isLastTrack: false,
    isLiked: false,
    isShuffleOn: false,
    isTrackReady: false,
  };

  state$ = new BehaviorSubject(this.defaultState);

  currentVolume = DEFAULT_PLAYER_VOLUME;

  volumeSaver: number | null = null;

  currentTrackIndex: number | null = null;

  audio = new Audio();

  constructor(
    private trackListState: StateService,
  ) { }

  playTrack(url: string | undefined): void {
    this.controlsState.isTrackReady = false;
    this.state$.next(this.defaultState);
    this.controlsState.isPlay = true;

    if (url) {
      this.audio.src = url;
      this.audio.load();
      this.bindListeners();
    }
  }

  bindListeners(): void {
    this.audio.addEventListener('loadedmetadata', () => {
      this.controlsState.isTrackReady = true;
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
      if (
        this.controlsState.isRepeatOneOn
        && this.currentTrackIndex !== null) {
        this.playTrack(this.trackList[this.currentTrackIndex].preview);
      } else if (
        !this.controlsState.isRepeatAllOn
        && this.controlsState.isLastTrack) {
        this.state$.next(this.defaultState);
        this.controlsState.isPlay = false;
      } else {
        this.next();
      }
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

  playPause(): void {
    if (this.controlsState.isTrackReady) {
      if (this.controlsState.isPlay) {
        this.audio.pause();
      } else {
        this.audio.play();
      }
      this.controlsState.isPlay = !this.controlsState.isPlay;
    }
  }

  setVolume(event: Event): void {
    const volumeBar = event.currentTarget;
    if (volumeBar instanceof HTMLInputElement) {
      this.audio.volume = Number(volumeBar.value);
      if (this.audio.volume === 0) {
        this.controlsState.isMute = true;
      } else {
        this.controlsState.isMute = false;
      }
    }
  }

  toggleMute(): void {
    let volume = 0;
    if (!this.controlsState.isMute) {
      this.volumeSaver = this.audio.volume;
    } else if (this.volumeSaver !== null) {
      volume = this.volumeSaver;
    }
    this.audio.volume = volume;
    this.currentVolume = this.audio.volume;
    this.controlsState.isMute = !this.controlsState.isMute;
  }

  setProgress(event: Event): void {
    const progressBar = event.target;
    if (progressBar instanceof HTMLElement) {
      const progress = progressBar.getAttribute('aria-valuetext');
      if (progress !== null) {
        this.audio.currentTime = Number(progress);
        this.updateProgress();
      }
    }
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

  setTrackIndex(index: number): void {
    this.currentTrackIndex = index;
    if (
      this.currentTrackIndex === 0
      && !this.controlsState.isRepeatAllOn) {
      this.controlsState.isFirstTrack = true;
      this.controlsState.isLastTrack = false;
    } else if (
      this.currentTrackIndex === this.trackList.length - 1
      && !this.controlsState.isRepeatAllOn) {
      this.controlsState.isLastTrack = true;
      this.controlsState.isFirstTrack = false;
    } else {
      this.controlsState.isLastTrack = false;
      this.controlsState.isFirstTrack = false;
    }
  }

  next(): void {
    if (this.currentTrackIndex !== null) {
      this.currentTrackIndex += 1;
      if (this.currentTrackIndex >= this.trackList.length) {
        if (this.controlsState.isRepeatAllOn) {
          this.currentTrackIndex = 0;
        } else {
          this.controlsState.isLastTrack = true;
        }
      }
      this.setTrackIndex(this.currentTrackIndex);
      this.playTrack(this.trackList[this.currentTrackIndex].preview);
    }
  }

  prev(): void {
    if (this.currentTrackIndex !== null) {
      this.currentTrackIndex -= 1;
      if (this.currentTrackIndex < 0) {
        if (this.controlsState.isRepeatAllOn) {
          this.currentTrackIndex = this.trackList.length - 1;
        } else {
          this.controlsState.isFirstTrack = true;
        }
      }
      this.setTrackIndex(this.currentTrackIndex);
      this.playTrack(this.trackList[this.currentTrackIndex].preview);
    }
  }

  toggleRepeat(): void {
    this.controlsState.isRepeatAllOn = !this.controlsState.isRepeatAllOn;
    this.controlsState.isRepeatOneOn = false;
    if (this.controlsState.isRepeatAllOn) {
      this.controlsState.isFirstTrack = false;
      this.controlsState.isLastTrack = false;
    } else if (this.currentTrackIndex === 0) {
      this.controlsState.isFirstTrack = true;
      this.controlsState.isLastTrack = false;
    } else if (this.currentTrackIndex === this.trackList.length - 1) {
      this.controlsState.isFirstTrack = false;
      this.controlsState.isLastTrack = true;
    } else {
      this.controlsState.isFirstTrack = false;
      this.controlsState.isLastTrack = false;
    }
  }

  toggleRepeatOne(): void {
    this.controlsState.isRepeatAllOn = false;
    this.controlsState.isRepeatOneOn = !this.controlsState.isRepeatOneOn;
  }

  likeTrack(): void {
    this.controlsState.isLiked = !this.controlsState.isLiked;
  }

  getTrackAlbumImageSrc(): string {
    const imageSrcPlaceholder = '';
    let imageSrc = imageSrcPlaceholder;
    if (this.currentTrackIndex !== null) {
      imageSrc = this.trackList[this.currentTrackIndex].album?.cover!;
    }
    return imageSrc;
  }

  getTrackTitle(): string {
    const trackTitlePlaceholder = '';
    let trackTitle = trackTitlePlaceholder;
    if (this.currentTrackIndex !== null) {
      trackTitle = this.trackList[this.currentTrackIndex].title!;
    }
    return trackTitle;
  }

  getTrackAlbumTitle(): string {
    const trackAlbumTitlePlaceholder = '';
    let trackAlbumTitle = trackAlbumTitlePlaceholder;
    if (this.currentTrackIndex !== null) {
      trackAlbumTitle = this.trackList[this.currentTrackIndex].album?.title!;
    }
    return trackAlbumTitle;
  }

  shuffleTracks(): void {
    if (this.trackList.length && this.currentTrackIndex) {
      const shuffledTracks = [...this.trackList];
      let lastTrackIndex = shuffledTracks.length - 1;
      let randomNum = 0;
      let tmp;

      while (lastTrackIndex) {
        randomNum = Math.floor(Math.random() * (lastTrackIndex + 1));
        tmp = shuffledTracks[lastTrackIndex];
        shuffledTracks[lastTrackIndex] = shuffledTracks[randomNum];
        shuffledTracks[randomNum] = tmp;
        lastTrackIndex -= 1;
      }

      const newCurrentTrackIndex = shuffledTracks
        .findIndex((track) => track.id === this.trackList[this.currentTrackIndex!].id);

      this.currentTrackIndex = newCurrentTrackIndex;
      this.trackList = shuffledTracks;
    }
  }
}
