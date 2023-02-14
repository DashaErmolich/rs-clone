import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';

import { StateService } from 'src/app/core/services/state.service';
import { MatSelect } from '@angular/material/select';
import { AudioService } from '../../core/services/audio.service';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { ThemeService } from '../../core/services/theme.service';
import {
  IEqualizerPresetsData,
  IEqualizerPreset,
  IEqualizerPresetsInfo,
  IEqualizerFrequencies,
} from '../../models/equalizer.models';

const equalizerPresetsData: Promise<IEqualizerPresetsData> = import('../../../assets/winamp-presets/winamp-presets.json');

@Component({
  selector: 'app-equalizer',
  templateUrl: './equalizer.component.html',
  styleUrls: ['./equalizer.component.scss'],
})

export class EqualizerComponent implements OnInit, AfterViewInit {
  isShown!: boolean;

  canvasWidth = window.innerWidth;

  @ViewChild('eqCanvas', { static: true }) myCanvas!: ElementRef;

  @ViewChild('presetSelect') presetSelect!: MatSelect;

  private canvas!: HTMLCanvasElement;

  private canvasContext!: CanvasRenderingContext2D | null;

  private reqAnimFrameId = 0;

  equalizerPresets: IEqualizerPreset[] = [];

  frequencies: IEqualizerFrequencies[] = this.myAudio.frequencies;

  equalizerPresetsInfo!: IEqualizerPresetsInfo;

  selectedPresetIndex!: number | null;

  constructor(
    private ngZone: NgZone,
    private myState: StateService,
    private myAudio: AudioService,
    private myStorage: LocalStorageService,
    private myTheme: ThemeService,
  ) {
  }

  ngOnInit() {
    this.myState.isEqualizerShown$.subscribe((data) => {
      this.isShown = data;
    });
    equalizerPresetsData.then((data: IEqualizerPresetsData) => {
      this.equalizerPresets = data.presets;
      this.equalizerPresetsInfo = {
        preampZeroValue: data.preampZeroValue,
        maxValueOfPlus12dB: data.maxValueOfPlus12dB,
        minValueOfPlus12dB: data.minValueOfPlus12dB,
      };
      this.selectedPresetIndex = this.myStorage.getEqualizerState() === null
        ? null
        : this.equalizerPresets
          .findIndex((preset) => preset.name === this.myStorage.getEqualizerState()?.name);
    });
    this.canvas = this.myCanvas.nativeElement;
    this.canvas.width = this.canvasWidth * (10 / 12);
    this.canvasContext = this.canvas.getContext('2d');
    if (this.canvasContext) {
      const gradient = this.canvasContext.createLinearGradient(0, 0, window.innerWidth, 0);
      let startColor = '';
      // eslint-disable-next-line default-case
      switch (this.myTheme.activeThemeCssClass.split('-dark').join('')) {
        case this.myTheme.themesData[0].cssClass:
          startColor = '#673ab7';
          break;
        case this.myTheme.themesData[1].cssClass:
          startColor = '#3f51b5';
          break;
        case this.myTheme.themesData[2].cssClass:
          startColor = '#e91e63';
          break;
        case this.myTheme.themesData[3].cssClass:
          startColor = '#9c27b0';
          break;
      }
      const finishColor = this.myTheme.isThemeDark ? '#fff' : '#000';
      gradient.addColorStop(0, startColor);
      gradient.addColorStop(1, finishColor);
      this.canvasContext.fillStyle = gradient;
    }

    this.ngZone.runOutsideAngular(() => {
      this.startEqualizerAnimation();
    });

    this.myAudio.audio.addEventListener('play', () => {
      if (this.isShown) {
        this.startEqualizerAnimation();
      }
    });

    this.myAudio.audio.addEventListener('timeupdate', () => {
      if (this.isShown) {
        this.startEqualizerAnimation();
      } else {
        this.stopEqualizerAnimation();
      }
    });

    this.myAudio.audio.addEventListener('pause', () => {
      this.stopEqualizerAnimation();
    });

    this.myAudio.audio.addEventListener('ended', () => {
      this.stopEqualizerAnimation();
    });
  }

  ngAfterViewInit(): void {
    this.presetSelect.valueChange.subscribe((data) => {
      this.setEqualizerPreset(Number(data));
      this.selectedPresetIndex = data;
    });
  }

  startEqualizerAnimation() {
    if (this.myAudio.analyser) {
      this.myAudio.analyser.fftSize = 2048;
      const bufferLength = this.myAudio.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      this.myAudio.analyser.getByteFrequencyData(dataArray);

      this.canvasContext?.clearRect(
        0,
        0,
        this.canvas.width,
        this.canvas.height,
      );

      let x = 0;
      for (let i = 0; i < 200; i += 1) {
        const barPosition = x;
        const barWidth = this.canvas.width / 200 - 1;
        const barHeight = (dataArray[i] / 2);

        this.canvasContext?.fillRect(
          barPosition,
          this.canvas.height - barHeight / 2,
          barWidth,
          barHeight,
        );

        x += barWidth + 1;
      }

      this.reqAnimFrameId = window.requestAnimationFrame(
        this.startEqualizerAnimation.bind(this),
      );
    }
  }

  stopEqualizerAnimation() {
    window.cancelAnimationFrame(this.reqAnimFrameId);
  }

  resetEqualizerPreset() {
    this.frequencies.forEach((frequency, i) => {
      frequency.initialVal = 0;
      this.myAudio.setGainAudioFilter(i, frequency.initialVal);
    });
    this.selectedPresetIndex = null;
    const preset: IEqualizerPreset = this.configEqualizerPreset();
    this.myStorage.setEqualizerState(preset);
  }

  changeGain(audioFilterIndex: number, event: Event) {
    const gainSlider = event.currentTarget;
    if (gainSlider instanceof HTMLInputElement && gainSlider.value) {
      this.myAudio.setGainAudioFilter(audioFilterIndex, Number(gainSlider.value));
      this.selectedPresetIndex = null;
      const preset: IEqualizerPreset = this.configEqualizerPreset();
      this.myStorage.setEqualizerState(preset);
    }
  }

  setEqualizerPreset(presetIndex: number): void {
    if (this.isShown) {
      const preset: IEqualizerPreset = this.equalizerPresets[presetIndex];
      const values = Object.values(preset).filter((value) => typeof value === 'number');
      values.forEach((value, i) => {
        const newVal = this.convertRange(
          value,
          {
            min: this.equalizerPresetsInfo.minValueOfPlus12dB,
            max: this.equalizerPresetsInfo.maxValueOfPlus12dB,
          },
          {
            min: this.frequencies[0].minVal,
            max: this.frequencies[0].maxVal,
          },
        );
        this.frequencies[i].initialVal = newVal;
        this.myAudio.setGainAudioFilter(i, newVal);
      });
    }
    const preset: IEqualizerPreset = this.configEqualizerPreset(this.equalizerPresets[presetIndex].name);
    this.myStorage.setEqualizerState(preset);
  }

  // eslint-disable-next-line class-methods-use-this
  convertRange(
    value: number,
    oldRange: { min: number, max: number },
    newRange: { min: number, max: number },
  ) {
    return Number(
      (
        (
          (value - oldRange.min)
          * (newRange.max - newRange.min))
          / (oldRange.max - oldRange.min)
          + newRange.min
      ).toFixed(1),
    );
  }

  configEqualizerPreset(presetTitle: string = 'manual') {
    const preset: IEqualizerPreset = {
      name: presetTitle,
      hz70: this.frequencies[0].initialVal,
      hz180: this.frequencies[1].initialVal,
      hz320: this.frequencies[2].initialVal,
      hz600: this.frequencies[3].initialVal,
      hz1000: this.frequencies[4].initialVal,
      hz3000: this.frequencies[5].initialVal,
      hz6000: this.frequencies[6].initialVal,
      hz12000: this.frequencies[7].initialVal,
      hz14000: this.frequencies[8].initialVal,
      hz16000: this.frequencies[9].initialVal,
    };
    return preset;
  }
}
