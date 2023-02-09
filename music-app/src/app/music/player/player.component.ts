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
    duration: this.getTime(0),
  };

  state$ = new BehaviorSubject(this.defaultState);

  currentProgress = this.defaultState.progress;

  currentTime = this.defaultState.time;

  durationTime: string = this.defaultState.duration;

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

    if (url) {
      this.audio.src = url;
      this.audio.load();
      this.audio.play();
      this.state$.subscribe(() => {
        this.currentProgress = this.state$.value.progress;
        this.currentTime = this.state$.value.time;
        this.durationTime = this.state$.value.duration;
      });

      this.audio.addEventListener('timeupdate', () => {
        this.updateProgress();
      });

      this.audio.addEventListener('ended', () => {
        this.state$.next(this.defaultState);
      });
    }
  }

  updateProgress() {
    this.state$.next({
      progress: this.getPercent(this.audio.currentTime, this.audio.duration),
      time: this.getTime(this.audio.currentTime),
      duration: this.getTotalTime(),
    });
  }

  play() {
    this.audio.play();
  }

  pause() {
    this.audio.pause();
  }

  setVolume(event: Event) {
    const volume = (event.target as HTMLElement).getAttribute('aria-valuetext');
    if (volume) {
      this.audio.volume = Number(volume);
    }
  }

  setProgress(event: Event) {
    console.log(event.target);
  }

  getTime(sec: number, format: string = 'mm:ss') {
    return moment.utc(sec * 1000).format(format);
  }

  getPercent(currentValue: number, totalValue: number): number {
    const result = (currentValue / totalValue) * 100;
    return result || 0;
  }

  getTotalTime() {
    const result = this.audio.duration;
    if (!result) {
      return this.getTime(0);
    }
    return this.getTime(result);
  }
}
