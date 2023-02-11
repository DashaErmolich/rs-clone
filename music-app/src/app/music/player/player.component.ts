import { Component, OnInit } from '@angular/core';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as moment from 'moment';
import { StateService } from 'src/app/core/services/state.service';
import { ITrackResponse } from '../../models/api-response.models';
import { IAudioPlayerState, IPlayerControlsState } from '../../models/audio-player.models';
import { AudioService } from '../../core/services/audio.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {
  trackList!: Partial<ITrackResponse>[];

  // defaultState: IAudioPlayerState = {
  //   progress: 0,
  //   time: this.getFormattedTime(0),
  //   durationTime: this.getFormattedTime(0),
  //   duration: 0,
  // };

  // currentState: IAudioPlayerState = {
  //   progress: this.defaultState.progress,
  //   time: this.defaultState.time,
  //   durationTime: this.defaultState.durationTime,
  //   duration: this.defaultState.duration,
  // };

  currentState!: IAudioPlayerState;

  controlsState: IPlayerControlsState = {
    isRepeatAllOn: false,
    isRepeatOneOn: false,
    isFirstTrack: false,
    isLastTrack: false,
    isLiked: false,
    isShuffleOn: false,
  };

  // state$ = new BehaviorSubject(this.defaultState);

  isPlay!: boolean;

  isMute!: boolean;

  isTrackReady!: boolean;

  currentVolume = this.myAudio.audio.volume;

  volumeSaver: number | null = null;

  currentTrackIndex: number | null = null;

  constructor(
    private myState: StateService,
    private myAudio: AudioService,
  ) { }

  ngOnInit(): void {
    this.myState.trackList$.subscribe((data: Partial<ITrackResponse>[]) => {
      this.trackList = data;
    });
    this.myState.playingTrackIndex$.subscribe((data: number) => {
      this.currentTrackIndex = data;
    });
    this.myAudio.state$.subscribe((data) => {
      this.currentState = data;
    });
    this.myAudio.isPlay$.subscribe((data) => {
      this.isPlay = data;
    });
    this.myAudio.isTrackReady$.subscribe((data) => {
      this.isTrackReady = data;
    });
    this.myAudio.isMute$.subscribe((data) => {
      this.isMute = data;
    });
  }

  playTrack(url: string | undefined): void {
    this.myAudio.isTrackReady$.next(false);
    this.myAudio.state$.next(this.myAudio.defaultState);
    this.myAudio.isPlay$.next(true);

    if (url) {
      this.myAudio.audio.src = url;
      this.myAudio.audio.load();
      this.myAudio.bindListeners();
    }
  }

  playPause(): void {
    if (this.isTrackReady) {
      if (this.isPlay) {
        this.myAudio.audio.pause();
      } else {
        this.myAudio.audio.play();
      }
      this.myAudio.isPlay$.next(!this.myAudio.isPlay$.value);
    }
  }

  setVolume(event: Event): void {
    const volumeBar = event.currentTarget;
    if (volumeBar instanceof HTMLInputElement) {
      this.myAudio.setVolume(Number(volumeBar.value));
    }
  }

  toggleMute(): void {
    let volume = 0;
    if (!this.isMute) {
      this.volumeSaver = this.myAudio.audio.volume;
    } else if (this.volumeSaver !== null) {
      volume = this.volumeSaver;
    }
    this.myAudio.setVolume(volume);
    this.currentVolume = volume;
  }

  setProgress(event: Event): void {
    const progressBar = event.target;
    if (progressBar instanceof HTMLElement) {
      const progress = progressBar.getAttribute('aria-valuetext');
      if (progress !== null) {
        this.myAudio.setCurrentTime(Number(progress));
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

  // setTrackIndex(index: number): void {
  //   this.myState.currentTrackIndex = index;
  //   if (
  //     this.myAudio.currentTrackIndex === 0
  //     && !this.myAudio.controlsState.isRepeatAllOn) {
  //     this.myAudio.controlsState.isFirstTrack = true;
  //     this.myAudio.controlsState.isLastTrack = false;
  //   } else if (
  //     this.myAudio.currentTrackIndex === this.trackList.length - 1
  //     && !this.myAudio.controlsState.isRepeatAllOn) {
  //     this.myAudio.controlsState.isLastTrack = true;
  //     this.myAudio.controlsState.isFirstTrack = false;
  //   } else {
  //     this.myAudio.controlsState.isLastTrack = false;
  //     this.myAudio.controlsState.isFirstTrack = false;
  //   }
  // }

  next(): void {
    if (this.currentTrackIndex !== null) {
      this.myState.setPlayingTrackIndex(this.currentTrackIndex += 1);
      if (this.currentTrackIndex >= this.trackList.length) {
        if (this.controlsState.isRepeatAllOn) {
          this.myState.setPlayingTrackIndex(0);
        } else {
          this.controlsState.isLastTrack = true;
        }
      }
      this.myAudio.playTrack(this.trackList[this.currentTrackIndex].preview!);
    }
  }

  prev(): void {
    if (this.currentTrackIndex !== null) {
      this.myState.setPlayingTrackIndex(this.currentTrackIndex -= 1);
      if (this.currentTrackIndex < 0) {
        if (this.controlsState.isRepeatAllOn) {
          this.myState.setPlayingTrackIndex(this.trackList.length - 1);
        } else {
          this.controlsState.isFirstTrack = true;
        }
      }
      this.myAudio.playTrack(this.trackList[this.currentTrackIndex].preview!);
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

      this.myState.playingTrackIndex.next(newCurrentTrackIndex);
      this.myState.trackList.next(shuffledTracks);
    }
  }

  getCurrentTrackIndex(): number | null {
    return this.currentTrackIndex;
  }
}
