import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';

import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ThemePalletsPrimaryColors, ThemePalletsContrastColors } from '../../enums/colors';
import { THEME_DARKNESS_SUFFIX } from '../../constants/constants';
import { StateService } from '../../services/state.service';
import { AudioService } from '../../services/audio.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { ThemeService } from '../../services/theme.service';
import {
  IEqualizerPresetsData,
  IEqualizerPreset,
  IEqualizerPresetsInfo,
  IEqualizerFrequencies,
} from '../../models/equalizer.models';

const equalizerPresetsData: Promise<IEqualizerPresetsData> = import('../../../assets/winamp-presets/winamp-presets.json');

const manualEqualizerSettingsTitle = 'manual';

@Component({
  selector: 'app-equalizer',
  templateUrl: './equalizer.component.html',
  styleUrls: ['./equalizer.component.scss'],
})

export class EqualizerComponent implements OnInit, AfterViewInit, OnDestroy {
  isShown!: boolean;

  @ViewChild('eqCanvas', { static: true }) myCanvas!: ElementRef;

  @ViewChild('presetSelect') presetSelect!: MatSelect;

  private canvas!: HTMLCanvasElement;

  private canvasContext!: CanvasRenderingContext2D | null;

  private reqAnimFrameId = 0;

  equalizerPresets: IEqualizerPreset[] = [];

  frequencies: IEqualizerFrequencies[] = this.myAudio.frequencies;

  equalizerPresetsInfo!: IEqualizerPresetsInfo;

  selectedPresetIndex!: number | null;

  routerEventSubscription!: Subscription;

  isPlay!: boolean;

  constructor(
    private ngZone: NgZone,
    private myState: StateService,
    private myAudio: AudioService,
    private myStorage: LocalStorageService,
    private myTheme: ThemeService,
    private myRouter: Router,
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

    this.setEqualizerCanvas();

    this.ngZone.runOutsideAngular(() => {
      this.startEqualizerAnimation();
    });

    this.routerEventSubscription = this.myRouter.events.subscribe(() => {
      this.myState.setEqualizerVisibility(false);
    });

    this.myAudio.isPlay$.subscribe((data) => {
      this.isPlay = data;
    });
  }

  ngAfterViewInit(): void {
    this.presetSelect.valueChange.subscribe((data) => {
      this.setEqualizerPreset(Number(data));
      this.selectedPresetIndex = data;
    });
  }

  ngOnDestroy(): void {
    this.routerEventSubscription.unsubscribe();
    this.presetSelect.valueChange.unsubscribe();
    this.stopEqualizerAnimation();
  }

  setEqualizerCanvas() {
    this.canvas = this.myCanvas.nativeElement;
    const layoutColumnCount = 12;
    const EqualizerColumnCount = 10;
    const canvasSizeCoefficient = EqualizerColumnCount / layoutColumnCount;
    this.canvas.width = window.innerWidth * canvasSizeCoefficient;
    this.canvasContext = this.canvas.getContext('2d');
    if (this.canvasContext) {
      const gradient = this.canvasContext.createLinearGradient(0, 0, window.innerWidth, 0);
      const startColor = this.getCanvasStartFillColor();
      const finishColor = this.getCanvasFinishFillColor();
      gradient.addColorStop(0, startColor);
      gradient.addColorStop(1, finishColor);
      this.canvasContext.fillStyle = gradient;
    }
  }

  getCanvasStartFillColor(): string {
    let startColor = '';
    switch (this.myTheme.activeThemeCssClass.split(THEME_DARKNESS_SUFFIX).join('')) {
      case this.myTheme.themesData[0].cssClass:
        startColor = ThemePalletsPrimaryColors.DeepPurpleAmber;
        break;
      case this.myTheme.themesData[1].cssClass:
        startColor = ThemePalletsPrimaryColors.IndigoPink;
        break;
      case this.myTheme.themesData[2].cssClass:
        startColor = ThemePalletsPrimaryColors.PinkBlueberry;
        break;
      case this.myTheme.themesData[3].cssClass:
        startColor = ThemePalletsPrimaryColors.PurpleGreen;
        break;
      default:
        startColor = ThemePalletsPrimaryColors.DeepPurpleAmber;
    }
    return startColor;
  }

  getCanvasFinishFillColor(): string {
    return this.myTheme.isThemeDark
      ? ThemePalletsContrastColors.DarkTheme
      : ThemePalletsContrastColors.LightTheme;
  }

  startEqualizerAnimation() {
    if (this.myAudio.analyser && this.isShown) {
      this.myAudio.analyser.fftSize = 512;
      const bufferLength = this.myAudio.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      this.myAudio.analyser.getByteFrequencyData(dataArray);

      this.canvasContext?.clearRect(
        0,
        0,
        this.canvas.width,
        this.canvas.height,
      );

      const barCount = 100;
      let x = 0;
      this.canvasContext?.save();
      for (let i = 0; i < barCount; i += 1) {
        const barPosition = x;
        const barWidth = this.canvas.width / barCount - 1;
        const barHeight = (dataArray[i] / 2);

        this.canvasContext?.fillRect(
          barPosition,
          this.canvas.height - barHeight / 2,
          barWidth,
          barHeight,
        );

        x += barWidth + 1;
      }

      this.canvasContext?.restore();

      this.reqAnimFrameId = requestAnimationFrame(
        this.startEqualizerAnimation.bind(this),
      );
    }
  }

  stopEqualizerAnimation() {
    cancelAnimationFrame(this.reqAnimFrameId);
  }

  resetEqualizerPreset() {
    this.frequencies.forEach((frequency, i) => {
      // eslint-disable-next-line no-param-reassign
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
    const preset: IEqualizerPreset = this.configEqualizerPreset(
      this.equalizerPresets[presetIndex].name,
    );
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

  configEqualizerPreset(presetTitle: string = manualEqualizerSettingsTitle) {
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
