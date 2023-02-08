/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';
import { Observable } from 'rxjs';
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

  currentTime: number = 0;

  totalTime: string = this.getTime(30);

  audioObject = new Audio();

  audioEvents = [
    'ended',
    'play',
  ];

  constructor(
    private deezerRestApiService: DeezerRestApiService,
    private audioService: AudioService,
  ) {}

  ngOnInit(): void {
    this.deezerRestApiService.getSearch('metallica', 0, 5).subscribe((response) => {
      this.tracks = response.data;
    });
  }

  playTrack(url: string | undefined) {
    if (url) {
      this.streamObserver(url).subscribe(() => {});
      console.log(url);
    }
  }

  play() {
    this.audioObject.play();
  }

  pause() {
    this.audioObject.pause();
  }

  setVolume(event: Event) {
    const volume = (event.target as HTMLElement).getAttribute('aria-valuetext');
    if (volume) {
      this.audioObject.volume = Number(volume);
    }
  }

  getTime(sec: number, format: string = 'mm:ss') {
    return moment.utc(sec * 1000).format(format);
  }

  streamObserver(url: string) {
    return new Observable((observer) => {
      this.audioObject.src = url;
      this.audioObject.load();
      this.audioObject.play();

      // const handler = (event: Event) => {
      //   console.log(event);
      // };

      // this.addEvent(handler);

      return () => {
        this.audioObject.pause();
        this.audioObject.currentTime = 0;
      };
    });
  }

  // addEvent(cb: (event: Event) => void) {
  //   cb();
  // }

  removeEvent() {

  }

  // getTimeProgress(): string {

  // }
}
