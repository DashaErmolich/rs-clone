// import { Component, OnInit } from '@angular/core';
// import { Observable } from 'rxjs';
// import { AudioService } from '../../services/audio.service';
// import { ITrackResponse } from '../../models/api-response.models';
// import { DeezerRestApiService } from '../../services/deezer-api.service';

// @Component({
//   selector: 'app-player',
//   templateUrl: './player.component.html',
//   styleUrls: ['./player.component.scss'],
// })
// export class PlayerComponent implements OnInit {
//   isLiked!: Observable<boolean>;

//   isFirstTrack!: boolean;

//   isPlay!: boolean;

//   isLastTrack!: boolean;

//   currentTime!: string;

//   durationTime!: string;

//   maxTimeValue!: number;

//   currentProgress!: number;

//   isMute!: boolean;

//   isRepeatAllOn!: boolean;

//   isRepeatOneOn!: boolean;

//   currentVolume!: number;

//   tracks!: Partial<ITrackResponse>[];

//   constructor(
//     private audioService: AudioService,
//     private deezerRestApiService: DeezerRestApiService,
//   ) {}

//   ngOnInit(): void {
//     this.isFirstTrack = this.audioService.isFirstTrack;
//     this.isPlay = this.audioService.isPlay;
//     this.isLastTrack = this.audioService.isLastTrack;
//     this.currentTime = this.audioService.currentTime;
//     this.durationTime = this.audioService.durationTime;
//     this.maxTimeValue = this.audioService.maxTimeValue;
//     this.currentProgress = this.audioService.currentProgress;
//     this.isMute = this.audioService.isMute;
//     this.isRepeatAllOn = this.audioService.isRepeatAllOn;
//     this.isRepeatOneOn = this.audioService.isRepeatOneOn;
//     this.currentVolume = this.audioService.currentVolume;
//     this.deezerRestApiService.getSearch('queen', 0, 5).subscribe((response) => {
//       this.tracks = response.data;
//     });
//   }

//   playTrack(url: string | undefined) {
//     this.audioService.tracks = this.tracks;
//     this.audioService.playTrack(url);
//   }

//   playPause() {
//     this.audioService.playPause();
//   }

//   setVolume(event: Event) {
//     this.audioService.setVolume(event);
//   }

//   toggleMute(): void {
//     this.audioService.toggleMute();
//   }

//   setProgress(event: Event) {
//     this.audioService.setProgress(event);
//   }

//   setTrackIndex(index: number) {
//     this.audioService.setTrackIndex(index);
//   }

//   next() {
//     this.audioService.next();
//   }

//   prev() {
//     this.audioService.prev();
//   }

//   toggleRepeat() {
//     this.audioService.toggleRepeat();
//   }

//   toggleRepeatOne() {
//     this.audioService.toggleRepeatOne();
//   }

//   likeTrack() {
//     this.audioService.likeTrack();
//   }

//   getValue() {
//     return this.audioService.isLiked$;
//   }
// }

/* eslint-disable max-len */
/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { DeezerRestApiService } from '../../services/deezer-api.service';
import { ITrackResponse } from '../../models/api-response.models';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {
  tracks!: Partial<ITrackResponse>[];

  initialValue: number = 0.5;

  defaultState = {
    progress: 0,
    time: this.getTime(0),
    durationTime: this.getTime(0),
    duration: 0,
  };

  state$ = new BehaviorSubject(this.defaultState);

  currentProgress = this.defaultState.progress;

  currentTime = this.defaultState.time;

  durationTime: string = this.defaultState.durationTime;

  maxTimeValue = this.defaultState.duration;

  currentVolume = 1;

  volumeSaver: number | null = null;

  isPlay = false;

  isMute = false;

  isRepeatAllOn = false;

  isRepeatOneOn = false;

  currentTrackIndex: number | null = null;

  isFirstTrack = false;

  isLastTrack = false;

  isLiked = false;

  audio = new Audio();

  constructor(
    private deezerRestApiService: DeezerRestApiService,
    private audioService: AudioService,
  ) {}

  ngOnInit(): void {
    this.deezerRestApiService.getSearch('queen', 0, 5).subscribe((response) => {
      this.tracks = response.data;
    });
  }

  playTrack(url: string | undefined) {
    // eslint-disable-next-line no-debugger
    // debugger;
    // eslint-disable-next-line no-console
    console.log(this.tracks);
    this.state$.next(this.defaultState);
    this.isPlay = true;

    if (url) {
      this.audio.src = url;
      this.audio.load();
      this.audio.play();
      this.state$.subscribe(() => {
        this.currentProgress = this.state$.value.progress;
        this.currentTime = this.state$.value.time;
        this.durationTime = this.state$.value.durationTime;
        this.maxTimeValue = this.state$.value.duration;
      });

      this.audio.addEventListener('timeupdate', () => {
        this.updateProgress();
      });

      this.audio.addEventListener('ended', () => {
        if (this.isRepeatOneOn && this.currentTrackIndex !== null) {
          this.playTrack(this.tracks[this.currentTrackIndex].preview);
        } else if (!this.isRepeatAllOn && this.isLastTrack) {
          this.state$.next(this.defaultState);
          this.isPlay = false;
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
    if (this.isPlay) {
      this.audio.pause();
    } else {
      this.audio.play();
    }
    this.isPlay = !this.isPlay;
  }

  setVolume(event: Event) {
    const volume = (event.target as HTMLInputElement).value;
    this.audio.volume = Number(volume);
    if (this.audio.volume === 0) {
      this.isMute = true;
    } else {
      this.isMute = false;
    }
  }

  toggleMute(): void {
    let volume = 0;
    if (!this.isMute) {
      this.volumeSaver = this.audio.volume;
    } else if (this.volumeSaver !== null) {
      volume = this.volumeSaver;
    }
    this.audio.volume = volume;
    this.currentVolume = this.audio.volume;
    this.isMute = !this.isMute;
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
    if (this.currentTrackIndex === 0 && !this.isRepeatAllOn) {
      this.isFirstTrack = true;
      this.isLastTrack = false;
    } else if (this.currentTrackIndex === this.tracks.length - 1 && !this.isRepeatAllOn) {
      this.isLastTrack = true;
      this.isFirstTrack = false;
    } else {
      this.isLastTrack = false;
      this.isFirstTrack = false;
    }
  }

  next() {
    if (this.currentTrackIndex !== null) {
      this.currentTrackIndex += 1;
      if (this.currentTrackIndex >= this.tracks.length) {
        if (this.isRepeatAllOn) {
          this.currentTrackIndex = 0;
        } else {
          this.isLastTrack = true;
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
        if (this.isRepeatAllOn) {
          this.currentTrackIndex = this.tracks.length - 1;
        } else {
          this.isFirstTrack = true;
        }
      }
      this.setTrackIndex(this.currentTrackIndex);
      this.playTrack(this.tracks[this.currentTrackIndex].preview);
    }
  }

  toggleRepeat() {
    this.isRepeatAllOn = !this.isRepeatAllOn;
    this.isRepeatOneOn = false;
    if (this.isRepeatAllOn) {
      this.isFirstTrack = false;
      this.isLastTrack = false;
    } else if (this.currentTrackIndex === 0) {
      this.isFirstTrack = true;
      this.isLastTrack = false;
    } else if (this.currentTrackIndex === this.tracks.length - 1) {
      this.isFirstTrack = false;
      this.isLastTrack = true;
    } else {
      this.isFirstTrack = false;
      this.isLastTrack = false;
    }
  }

  toggleRepeatOne() {
    this.isRepeatAllOn = false;
    this.isRepeatOneOn = !this.isRepeatOneOn;
  }

  likeTrack() {
    this.isLiked = !this.isLiked;
  }
}
