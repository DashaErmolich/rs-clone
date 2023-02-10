import { Component, OnInit } from '@angular/core';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { DeezerRestApiService } from '../../services/deezer-api.service';
import { ITrackResponse } from '../../models/api-response.models';
import { IAudioPlayerState, IPlayerControlsState } from '../../models/audio-player.models';

const DEFAULT_PLAYER_VOLUME = 1;

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {
  tracks!: Partial<ITrackResponse>[];

  initialValue: number = 0.5;

  defaultState: IAudioPlayerState = {
    progress: 0,
    time: this.getTime(0),
    durationTime: this.getTime(0),
    duration: 0,
  };

  currentState: IAudioPlayerState = {
    progress: this.defaultState.progress,
    time: this.defaultState.time,
    durationTime: this.defaultState.durationTime,
    duration: this.defaultState.duration,
  };

  playerControlsState: IPlayerControlsState = {
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
    private deezerRestApiService: DeezerRestApiService,
  ) {}

  ngOnInit(): void {
    this.deezerRestApiService.getSearch('queen', 0, 5).subscribe((response) => {
      this.tracks = response.data;
    });
  }

  playTrack(url: string | undefined) {
    this.playerControlsState.isTrackReady = false;
    this.state$.next(this.defaultState);
    this.playerControlsState.isPlay = true;

    if (url) {
      this.audio.src = url;
      this.audio.load();

      this.audio.addEventListener('loadedmetadata', () => {
        this.playerControlsState.isTrackReady = true;
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
          this.playerControlsState.isRepeatOneOn
          && this.currentTrackIndex !== null) {
          this.playTrack(this.tracks[this.currentTrackIndex].preview);
        } else if (
          !this.playerControlsState.isRepeatAllOn
          && this.playerControlsState.isLastTrack) {
          this.state$.next(this.defaultState);
          this.playerControlsState.isPlay = false;
        } else {
          this.next();
        }
      });
    }
  }

  updateProgress() {
    this.state$.next({
      progress: this.audio.currentTime,
      time: this.getTime(this.audio.currentTime),
      durationTime: this.getTotalTime(),
      duration: this.audio.duration,
    });
  }

  playPause() {
    if (this.playerControlsState.isTrackReady) {
      if (this.playerControlsState.isPlay) {
        this.audio.pause();
      } else {
        this.audio.play();
      }
      this.playerControlsState.isPlay = !this.playerControlsState.isPlay;
    }
  }

  setVolume(event: Event) {
    const volume = (event.target as HTMLInputElement).value;
    this.audio.volume = Number(volume);
    if (this.audio.volume === 0) {
      this.playerControlsState.isMute = true;
    } else {
      this.playerControlsState.isMute = false;
    }
  }

  toggleMute(): void {
    let volume = 0;
    if (!this.playerControlsState.isMute) {
      this.volumeSaver = this.audio.volume;
    } else if (this.volumeSaver !== null) {
      volume = this.volumeSaver;
    }
    this.audio.volume = volume;
    this.currentVolume = this.audio.volume;
    this.playerControlsState.isMute = !this.playerControlsState.isMute;
  }

  setProgress(event: Event) {
    const progress = (event.target as HTMLElement).getAttribute('aria-valuetext');
    if (progress) {
      this.audio.currentTime = Number(progress);
      this.updateProgress();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  getTime(sec: number, format: string = 'mm:ss') {
    return moment.utc(sec * 1000).format(format);
  }

  getTotalTime() {
    const result = this.audio.duration;
    if (!result) {
      return this.getTime(0);
    }
    return this.getTime(result);
  }

  setTrackIndex(index: number) {
    this.currentTrackIndex = index;
    if (
      this.currentTrackIndex === 0
      && !this.playerControlsState.isRepeatAllOn) {
      this.playerControlsState.isFirstTrack = true;
      this.playerControlsState.isLastTrack = false;
    } else if (
      this.currentTrackIndex === this.tracks.length - 1
      && !this.playerControlsState.isRepeatAllOn) {
      this.playerControlsState.isLastTrack = true;
      this.playerControlsState.isFirstTrack = false;
    } else {
      this.playerControlsState.isLastTrack = false;
      this.playerControlsState.isFirstTrack = false;
    }
  }

  next() {
    if (this.currentTrackIndex !== null) {
      this.currentTrackIndex += 1;
      if (this.currentTrackIndex >= this.tracks.length) {
        if (this.playerControlsState.isRepeatAllOn) {
          this.currentTrackIndex = 0;
        } else {
          this.playerControlsState.isLastTrack = true;
        }
      }
      this.setTrackIndex(this.currentTrackIndex);
      this.playTrack(this.tracks[this.currentTrackIndex].preview);
    }
  }

  prev() {
    if (this.currentTrackIndex !== null) {
      this.currentTrackIndex -= 1;
      if (this.currentTrackIndex < 0) {
        if (this.playerControlsState.isRepeatAllOn) {
          this.currentTrackIndex = this.tracks.length - 1;
        } else {
          this.playerControlsState.isFirstTrack = true;
        }
      }
      this.setTrackIndex(this.currentTrackIndex);
      this.playTrack(this.tracks[this.currentTrackIndex].preview);
    }
  }

  toggleRepeat() {
    this.playerControlsState.isRepeatAllOn = !this.playerControlsState.isRepeatAllOn;
    this.playerControlsState.isRepeatOneOn = false;
    if (this.playerControlsState.isRepeatAllOn) {
      this.playerControlsState.isFirstTrack = false;
      this.playerControlsState.isLastTrack = false;
    } else if (this.currentTrackIndex === 0) {
      this.playerControlsState.isFirstTrack = true;
      this.playerControlsState.isLastTrack = false;
    } else if (this.currentTrackIndex === this.tracks.length - 1) {
      this.playerControlsState.isFirstTrack = false;
      this.playerControlsState.isLastTrack = true;
    } else {
      this.playerControlsState.isFirstTrack = false;
      this.playerControlsState.isLastTrack = false;
    }
  }

  toggleRepeatOne() {
    this.playerControlsState.isRepeatAllOn = false;
    this.playerControlsState.isRepeatOneOn = !this.playerControlsState.isRepeatOneOn;
  }

  likeTrack() {
    this.playerControlsState.isLiked = !this.playerControlsState.isLiked;
  }

  getTrackAlbumImageSrc(): string {
    const imageSrcPlaceholder = '';
    let imageSrc = imageSrcPlaceholder;
    if (this.currentTrackIndex !== null) {
      imageSrc = this.tracks[this.currentTrackIndex].album?.cover!;
    }
    return imageSrc;
  }

  getTrackTitle(): string {
    const trackTitlePlaceholder = '';
    let trackTitle = trackTitlePlaceholder;
    if (this.currentTrackIndex !== null) {
      trackTitle = this.tracks[this.currentTrackIndex].title!;
    }
    return trackTitle;
  }

  getTrackAlbumTitle(): string {
    const trackAlbumTitlePlaceholder = '';
    let trackAlbumTitle = trackAlbumTitlePlaceholder;
    if (this.currentTrackIndex !== null) {
      trackAlbumTitle = this.tracks[this.currentTrackIndex].album?.title!;
    }
    return trackAlbumTitle;
  }

  shuffleTracks(): void {
    if (this.tracks.length && this.currentTrackIndex) {
      const shuffledTracks = [...this.tracks];
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
        .findIndex((track) => track.id === this.tracks[this.currentTrackIndex!].id);

      this.currentTrackIndex = newCurrentTrackIndex;
      this.tracks = shuffledTracks;
    }
  }
}
