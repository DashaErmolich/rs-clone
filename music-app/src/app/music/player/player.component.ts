/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
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
        this.state$.next(this.defaultState);
        this.isPlay = false;
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
    console.log(this.state$);
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
}
