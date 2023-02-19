import {
  Component,
  OnInit,
} from '@angular/core';

import {
  animate,
  style,
  transition,
  trigger,
} from '@angular/animations';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { ITrackResponse } from '../../models/api-response.models';
import { IAudioPlayerState, IPlayerControlsState } from '../../models/audio-player.models';

import { StateService } from '../../services/state.service';
import { AudioService } from '../../services/audio.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { ThemeHelper } from '../../helpers/theme-helper';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  animations: [
    trigger('showEqualizer', [
      transition(':enter', [
        style({ transform: 'translateY(100vh)' }),
        animate('500ms', style({ transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('500ms', style({ transform: 'translateY(100vh)' })),
      ]),
    ]),
  ],
})

export class PlayerComponent extends ThemeHelper implements OnInit {
  trackList!: Partial<ITrackResponse>[];

  currentTrackIndex!: number | null;

  currentState!: IAudioPlayerState;

  isPlay!: boolean;

  isEnded!: boolean;

  isMute!: boolean;

  isTrackReady!: boolean;

  isInitialTrackSet = false;

  isEqualizerShown!: boolean;

  controlsState: IPlayerControlsState = {
    isRepeatAllOn: this.myStorage.getPlayerInfo()?.isRepeatAllOn !== undefined
      ? this.myStorage.getPlayerInfo()?.isRepeatAllOn! : false,
    isRepeatOneOn: this.myStorage.getPlayerInfo()?.isRepeatOneOn !== undefined
      ? this.myStorage.getPlayerInfo()?.isRepeatOneOn! : false,
    isFirstTrack: false,
    isLastTrack: false,
    isLiked: false,
    isShuffleOn: false,
  };

  likedTracks!: number[];

  volumeSaver: number | null = null;

  isSmall = false;

  constructor(
    myTheme: ThemeService,
    private myState: StateService,
    private myAudio: AudioService,
    private myStorage: LocalStorageService,
    private responsive: BreakpointObserver,
  ) {
    super(myTheme);
  }

  ngOnInit(): void {
    this.myState.trackList$.subscribe((data: Partial<ITrackResponse>[]) => {
      this.trackList = data;
    });
    this.myState.playingTrackIndex$.subscribe((data: number | null) => {
      this.currentTrackIndex = data;
      this.checkTrackPosition();
      if (this.likedTracks) {
        this.isTrackLiked();
      }
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
    this.myState.isEqualizerShown$.subscribe((data) => {
      this.isEqualizerShown = data;
    });

    if (this.currentTrackIndex !== null) {
      this.isInitialTrackSet = true;
    }

    this.myState.likedTracks$.subscribe((data) => {
      this.likedTracks = data;
      this.isTrackLiked();
    });

    this.responsive.observe([
      Breakpoints.Small,
    ]).subscribe((result) => {
      if (result.matches) {
        this.isSmall = true;
        console.log('small', result.breakpoints);
      } else {
        this.isSmall = false;
      }
      console.log(this.isSmall);
    });
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
    if (volumeBar instanceof HTMLInputElement && volumeBar.value) {
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
    this.myStorage.setPlayerInfo(
      this.controlsState.isRepeatAllOn,
      this.controlsState.isRepeatOneOn,
    );
  }

  toggleRepeatOne(): void {
    this.controlsState.isRepeatAllOn = false;
    this.controlsState.isRepeatOneOn = !this.controlsState.isRepeatOneOn;
    this.myStorage.setPlayerInfo(
      this.controlsState.isRepeatAllOn,
      this.controlsState.isRepeatOneOn,
    );
  }

  getTrackAlbumImageSrc(): string {
    const imageSrcPlaceholder = '';
    let imageSrc = imageSrcPlaceholder;
    if (this.currentTrackIndex !== null && this.trackList.length) {
      imageSrc = this.trackList[this.currentTrackIndex].album?.cover!;
    }
    return imageSrc;
  }

  getTrackTitle(): string {
    const trackTitlePlaceholder = '';
    let trackTitle = trackTitlePlaceholder;
    if (this.currentTrackIndex !== null && this.trackList.length) {
      trackTitle = this.trackList[this.currentTrackIndex].title!;
    }
    return trackTitle;
  }

  getTrackAlbumTitle(): string {
    const trackAlbumTitlePlaceholder = '';
    let trackAlbumTitle = trackAlbumTitlePlaceholder;
    if (this.currentTrackIndex !== null && this.trackList.length) {
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

      let newCurrentTrackIndex = shuffledTracks
        .findIndex((track) => track.id === this.trackList[this.currentTrackIndex!].id);

      if (newCurrentTrackIndex !== 0) {
        const currentTrack = shuffledTracks[newCurrentTrackIndex];
        const firstTrack = shuffledTracks[0];
        shuffledTracks[0] = currentTrack;
        shuffledTracks[newCurrentTrackIndex] = firstTrack;
        newCurrentTrackIndex = 0;
      }

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

  toggleEqualizerVisibility() {
    this.myState.setEqualizerVisibility(!this.isEqualizerShown);
  }

  isTrackLiked(): boolean {
    const index = this.likedTracks
      .findIndex((trackId) => trackId === this.trackList[this.currentTrackIndex!]!.id);
    const isLiked = index >= 0;
    this.controlsState.isLiked = isLiked;
    return index >= 0;
  }

  likeTrack(): void {
    this.controlsState.isLiked = !this.controlsState.isLiked;
    if (this.controlsState.isLiked) {
      this.myState.setLikedTrack(this.trackList[this.currentTrackIndex!].id!);
    } else {
      this.myState.removeLikedTrack(this.trackList[this.currentTrackIndex!].id!);
    }
  }
}
