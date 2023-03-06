import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';
import { IAudioPlayerState } from '../models/audio-player.models';
import { LocalStorageService } from './local-storage.service';
import { IEqualizerFrequencies } from '../models/equalizer.models';

const DEFAULT_PLAYER_VOLUME = 1;

@Injectable({
  providedIn: 'root',
})

export class AudioService {
  storageVolume: number | null = this.storage.getPlayerVolume();

  defaultState: IAudioPlayerState = {
    progress: 0,
    time: this.getFormattedTime(0),
    durationTime: this.getFormattedTime(0),
    duration: 0,
    volume: this.storageVolume === null ? DEFAULT_PLAYER_VOLUME : this.storageVolume,
  };

  currentState: IAudioPlayerState = {
    progress: this.defaultState.progress,
    time: this.defaultState.time,
    durationTime: this.defaultState.durationTime,
    duration: this.defaultState.duration,
    volume: this.defaultState.volume,
  };

  isTrackReady$ = new BehaviorSubject(false);

  isPlay$ = new BehaviorSubject(false);

  isPause$ = new BehaviorSubject(false);

  isMute$ = new BehaviorSubject(this.defaultState.volume === 0);

  state$ = new BehaviorSubject(this.defaultState);

  audio = new Audio();

  audioContext!: AudioContext;

  analyser!: AnalyserNode;

  preset = this.storage.getEqualizerState();

  public frequencies: IEqualizerFrequencies[] = [
    {
      frequency: 70,
      minVal: -12,
      maxVal: 12,
      initialVal: this.preset === null ? 0 : this.preset.hz70,
    },
    {
      frequency: 180,
      minVal: -12,
      maxVal: 12,
      initialVal: this.preset === null ? 0 : this.preset.hz180,
    },
    {
      frequency: 320,
      minVal: -12,
      maxVal: 12,
      initialVal: this.preset === null ? 0 : this.preset.hz320,
    },
    {
      frequency: 600,
      minVal: -12,
      maxVal: 12,
      initialVal: this.preset === null ? 0 : this.preset.hz600,
    },
    {
      frequency: 1000,
      minVal: -12,
      maxVal: 12,
      initialVal: this.preset === null ? 0 : this.preset.hz1000,
    },
    {
      frequency: 3000,
      minVal: -12,
      maxVal: 12,
      initialVal: this.preset === null ? 0 : this.preset.hz3000,
    },
    {
      frequency: 6000,
      minVal: -12,
      maxVal: 12,
      initialVal: this.preset === null ? 0 : this.preset.hz6000,
    },
    {
      frequency: 12000,
      minVal: -12,
      maxVal: 12,
      initialVal: this.preset === null ? 0 : this.preset.hz12000,
    },
    {
      frequency: 14000,
      minVal: -12,
      maxVal: 12,
      initialVal: this.preset === null ? 0 : this.preset.hz14000,
    },
    {
      frequency: 16000,
      minVal: -12,
      maxVal: 12,
      initialVal: this.preset === null ? 0 : this.preset.hz16000,
    },
  ];

  audioFilters: BiquadFilterNode[] = [];

  constructor(
    private storage: LocalStorageService,
  ) {
    this.audio.volume = this.storageVolume === null ? DEFAULT_PLAYER_VOLUME : this.storageVolume;
    this.audio.crossOrigin = 'anonymous';
  }

  playTrack(url: string): void {
    this.isTrackReady$.next(false);
    this.state$.next(this.defaultState);
    this.isPlay$.next(true);

    if (url) {
      this.audio.src = url;
      this.audio.load();
      this.bindListeners();
    }
  }

  bindListeners(): void {
    this.audio.addEventListener('loadedmetadata', () => {
      this.isTrackReady$.next(true);
      this.isPlay$.next(true);
      this.audio.play();
      this.state$.subscribe(() => {
        this.currentState.progress = this.state$.value.progress;
        this.currentState.time = this.state$.value.time;
        this.currentState.durationTime = this.state$.value.durationTime;
        this.currentState.duration = this.state$.value.duration;
        this.currentState.volume = this.state$.value.volume;
      });
      if (!this.audioContext) {
        this.audioContext = new AudioContext();
        this.analyser = this.audioContext.createAnalyser();
        const source = this.audioContext.createMediaElementSource(this.audio);

        this.frequencies.forEach((element, index) => {
          const filter = this.audioContext?.createBiquadFilter();
          if (filter) {
            filter.type = 'peaking';
            filter.frequency.value = element.frequency;
            filter.gain.value = 0;
            this.audioFilters.push(filter);
            if (this.audioFilters[index - 1]) {
              this.audioFilters[index - 1].connect(this.audioFilters[index]);
            }
          }
        });
        source.connect(this.audioFilters[0]);
        this.audioFilters[this.audioFilters.length - 1].connect(
          this.analyser,
        );
        this.analyser.connect(this.audioContext.destination);
        this.frequencies.forEach((data, i) => {
          this.setGainAudioFilter(i, data.initialVal);
        });
      }
    });

    this.audio.addEventListener('timeupdate', () => {
      this.updateProgress();
    });
  }

  updateProgress(): void {
    this.state$.next({
      progress: this.audio.currentTime,
      time: this.getFormattedTime(this.audio.currentTime),
      durationTime: this.getTotalTime(),
      duration: this.audio.duration,
      volume: this.audio.volume,
    });
  }

  play(): void {
    this.audio.play();
    this.isPlay$.next(!this.isPlay$.value);
    this.isPause$.next(!this.isPause$.value);
  }

  pause(): void {
    this.audio.pause();
    this.isPlay$.next(!this.isPlay$.value);
    this.isPause$.next(!this.isPause$.value);
  }

  setVolume(volume: number): void {
    this.audio.volume = volume;
    if (this.audio.volume === 0) {
      this.isMute$.next(true);
    } else {
      this.isMute$.next(false);
    }
    this.updateProgress();
    this.storage.setPlayerVolume(this.audio.volume);
  }

  setCurrentTime(currentTime: number): void {
    this.audio.currentTime = currentTime;
    this.updateProgress();
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

  setGainAudioFilter(audioFilterIndex: number, gainValue: number): void {
    this.audioFilters[audioFilterIndex].gain.value = gainValue;
  }

  resetState() {
    this.state$.next(this.defaultState);
    this.isTrackReady$.next(false);
    this.isPlay$.next(false);
    this.isPause$.next(false);
    this.audio.pause();
    this.isMute$.next(this.defaultState.volume === 0);
    this.state$.next(this.defaultState);
    this.preset = null;
  }
}
