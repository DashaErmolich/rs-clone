import { Component, OnInit } from '@angular/core';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { StateService } from 'src/app/core/services/state.service';
import { ITrackResponse } from '../../models/api-response.models';
import { IAudioPlayerState, IPlayerControlsState } from '../../models/audio-player.models';
import { AudioService } from '../../core/services/audio.service';

const DEFAULT_PLAYER_VOLUME = 1;

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {
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

  constructor(
    private trackListState: StateService,
    private myAudio: AudioService,
  ) { }

  ngOnInit(): void {
    this.trackListState.trackList$.subscribe((data: Partial<ITrackResponse>[]) => {
      this.trackList = data;
    });
    this.trackListState.playingTrackIndex$.subscribe((data: number) => {
      this.currentTrackIndex = data;
    });
    this.myAudio.controls$.subscribe((data) => {
      this.controlsState = data;
    });
    this.myAudio.state$.subscribe((data) => {
      this.currentState = data;
    });
  }

  playTrack(url: string | undefined): void {
    this.myAudio.controlsState.isTrackReady = false;
    this.state$.next(this.defaultState);
    this.myAudio.controlsState.isPlay = true;

    if (url) {
      this.myAudio.audio.src = url;
      this.myAudio.audio.load();
      this.myAudio.bindListeners(url);
    }
  }

  playPause(): void {
    if (this.myAudio.controlsState.isTrackReady) {
      if (this.myAudio.controlsState.isPlay) {
        this.myAudio.audio.pause();
      } else {
        this.myAudio.audio.play();
      }
      this.myAudio.controlsState.isPlay = !this.myAudio.controlsState.isPlay;
    }
  }

  setVolume(event: Event): void {
    const volumeBar = event.currentTarget;
    if (volumeBar instanceof HTMLInputElement) {
      this.myAudio.audio.volume = Number(volumeBar.value);
      if (this.myAudio.audio.volume === 0) {
        this.myAudio.controlsState.isMute = true;
      } else {
        this.myAudio.controlsState.isMute = false;
      }
    }
  }

  toggleMute(): void {
    let volume = 0;
    if (!this.myAudio.controlsState.isMute) {
      this.myAudio.volumeSaver = this.myAudio.audio.volume;
    } else if (this.myAudio.volumeSaver !== null) {
      volume = this.myAudio.volumeSaver;
    }
    this.myAudio.audio.volume = volume;
    this.currentVolume = this.myAudio.audio.volume;
    this.myAudio.controlsState.isMute = !this.myAudio.controlsState.isMute;
  }

  setProgress(event: Event): void {
    const progressBar = event.target;
    if (progressBar instanceof HTMLElement) {
      const progress = progressBar.getAttribute('aria-valuetext');
      if (progress !== null) {
        this.myAudio.audio.currentTime = Number(progress);
        this.myAudio.updateProgress();
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  getFormattedTime(sec: number, format: string = 'mm:ss'): string {
    return moment.utc(sec * 1000).format(format);
  }

  getTotalTime(): string {
    const result = this.myAudio.audio.duration;
    if (!result) {
      return this.getFormattedTime(0);
    }
    return this.getFormattedTime(result);
  }

  setTrackIndex(index: number): void {
    this.currentTrackIndex = index;
    if (
      this.currentTrackIndex === 0
      && !this.myAudio.controlsState.isRepeatAllOn) {
      this.myAudio.controlsState.isFirstTrack = true;
      this.myAudio.controlsState.isLastTrack = false;
    } else if (
      this.currentTrackIndex === this.trackList.length - 1
      && !this.myAudio.controlsState.isRepeatAllOn) {
      this.myAudio.controlsState.isLastTrack = true;
      this.myAudio.controlsState.isFirstTrack = false;
    } else {
      this.myAudio.controlsState.isLastTrack = false;
      this.myAudio.controlsState.isFirstTrack = false;
    }
  }

  next(): void {
    if (this.currentTrackIndex !== null) {
      this.currentTrackIndex += 1;
      if (this.currentTrackIndex >= this.trackList.length) {
        if (this.myAudio.controlsState.isRepeatAllOn) {
          this.currentTrackIndex = 0;
        } else {
          this.myAudio.controlsState.isLastTrack = true;
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
        if (this.myAudio.controlsState.isRepeatAllOn) {
          this.currentTrackIndex = this.trackList.length - 1;
        } else {
          this.myAudio.controlsState.isFirstTrack = true;
        }
      }
      this.setTrackIndex(this.currentTrackIndex);
      this.playTrack(this.trackList[this.currentTrackIndex].preview);
    }
  }

  toggleRepeat(): void {
    this.myAudio.controlsState.isRepeatAllOn = !this.myAudio.controlsState.isRepeatAllOn;
    this.myAudio.controlsState.isRepeatOneOn = false;
    if (this.myAudio.controlsState.isRepeatAllOn) {
      this.myAudio.controlsState.isFirstTrack = false;
      this.myAudio.controlsState.isLastTrack = false;
    } else if (this.currentTrackIndex === 0) {
      this.myAudio.controlsState.isFirstTrack = true;
      this.myAudio.controlsState.isLastTrack = false;
    } else if (this.currentTrackIndex === this.trackList.length - 1) {
      this.myAudio.controlsState.isFirstTrack = false;
      this.myAudio.controlsState.isLastTrack = true;
    } else {
      this.myAudio.controlsState.isFirstTrack = false;
      this.myAudio.controlsState.isLastTrack = false;
    }
  }

  toggleRepeatOne(): void {
    this.myAudio.controlsState.isRepeatAllOn = false;
    this.myAudio.controlsState.isRepeatOneOn = !this.myAudio.controlsState.isRepeatOneOn;
  }

  likeTrack(): void {
    this.myAudio.controlsState.isLiked = !this.myAudio.controlsState.isLiked;
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

  getTimeProgress(): string {
    return this.currentState.time;
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

      this.trackListState.playingTrackIndex.next(newCurrentTrackIndex);
      this.trackListState.trackList.next(shuffledTracks);
    }
  }
}
