import { Component, OnInit } from '@angular/core';

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

  currentTrackIndex!: number | null;

  currentState!: IAudioPlayerState;

  isPlay!: boolean;

  isEnded!: boolean;

  isMute!: boolean;

  isTrackReady!: boolean;

  isInitialTrackSet = false;

  controlsState: IPlayerControlsState = {
    isRepeatAllOn: false,
    isRepeatOneOn: false,
    isFirstTrack: false,
    isLastTrack: false,
    isLiked: false,
    isShuffleOn: false,
  };

  volumeSaver: number | null = null;

  constructor(
    private myState: StateService,
    private myAudio: AudioService,
  ) { }

  ngOnInit(): void {
    this.myState.trackList$.subscribe((data: Partial<ITrackResponse>[]) => {
      this.trackList = data;
    });
    this.myState.playingTrackIndex$.subscribe((data: number | null) => {
      this.currentTrackIndex = data;
      this.checkTrackPosition();
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
    this.myAudio.audio.addEventListener('ended', () => {
      this.playNext();
    });

    if (this.currentTrackIndex !== null) {
      this.isInitialTrackSet = true;
    }
  }

  playNext(): void {
    if (this.controlsState.isRepeatOneOn && this.currentTrackIndex !== null) {
      this.myAudio.playTrack(this.trackList[this.currentTrackIndex].preview!);
    } else if (!this.controlsState.isRepeatOneOn && this.controlsState.isLastTrack) {
      this.myAudio.pause();
    } else {
      this.next();
    }
  }

  playPause(): void {
    if (this.isInitialTrackSet && !this.isTrackReady) {
      this.myAudio.playTrack(this.trackList[this.currentTrackIndex!].preview!);
    } else if (this.isTrackReady) {
      if (this.isPlay) {
        this.myAudio.pause();
      } else {
        this.myAudio.play();
      }
    }
    this.isInitialTrackSet = false;
  }

  setVolume(event: Event): void {
    const volumeBar = event.currentTarget;
    if (volumeBar instanceof HTMLInputElement && Number(volumeBar.value)) {
      this.myAudio.setVolume(Number(volumeBar.value));
    }
  }

  toggleMute(): void {
    let volume = 0;
    if (!this.isMute) {
      this.volumeSaver = this.currentState.volume;
    } else if (this.volumeSaver !== null) {
      volume = this.volumeSaver;
    }
    this.myAudio.setVolume(volume);
  }

  setProgress(event: Event): void {
    const progressBar = event.target;
    if (progressBar instanceof HTMLElement) {
      const progress = progressBar.getAttribute('aria-valuetext');
      if (progress !== null && Number(progress)) {
        this.myAudio.setCurrentTime(Number(progress));
      }
    }
  }

  next(): void {
    if (this.currentTrackIndex !== null) {
      let nextTrackIndex = this.currentTrackIndex + 1;
      if (nextTrackIndex >= this.trackList.length && this.controlsState.isRepeatAllOn) {
        nextTrackIndex = 0;
      }
      this.checkTrackPosition();
      this.myState.setPlayingTrackIndex(nextTrackIndex);
      this.myAudio.playTrack(this.trackList[this.currentTrackIndex].preview!);
    }
  }

  prev(): void {
    if (this.currentTrackIndex !== null) {
      let prevTrackIndex = this.currentTrackIndex - 1;
      if (prevTrackIndex < 0 && this.controlsState.isRepeatAllOn) {
        prevTrackIndex = this.trackList.length - 1;
      }
      this.checkTrackPosition();
      this.myState.setPlayingTrackIndex(prevTrackIndex);
      this.myAudio.playTrack(this.trackList[this.currentTrackIndex].preview!);
    }
  }

  toggleRepeatAll(): void {
    this.controlsState.isRepeatAllOn = !this.controlsState.isRepeatAllOn;
    this.controlsState.isRepeatOneOn = false;
    this.checkTrackPosition();
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
    if (this.trackList.length && this.currentTrackIndex !== null) {
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

      this.myState.setTrackListInfo(shuffledTracks, newCurrentTrackIndex);
      this.checkTrackPosition();
    }
  }

  checkTrackPosition() {
    const currentIndex = this.currentTrackIndex;
    const isCurrentFirstTrack = currentIndex === 0;
    const isCurrentLastTrack = currentIndex === this.trackList.length - 1;

    if (this.controlsState.isRepeatAllOn) {
      this.controlsState.isFirstTrack = false;
      this.controlsState.isLastTrack = false;
    } else if (isCurrentFirstTrack) {
      this.controlsState.isFirstTrack = true;
      this.controlsState.isLastTrack = false;
    } else if (isCurrentLastTrack) {
      this.controlsState.isFirstTrack = false;
      this.controlsState.isLastTrack = true;
    } else {
      this.controlsState.isFirstTrack = false;
      this.controlsState.isLastTrack = false;
    }
  }

  getCurrentTrackIndex(): number | null {
    return this.currentTrackIndex;
  }
}
