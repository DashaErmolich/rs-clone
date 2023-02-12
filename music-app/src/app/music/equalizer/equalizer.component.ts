import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';

import { StateService } from 'src/app/core/services/state.service';
import { AudioService } from '../../core/services/audio.service';
import { IEqualizerPresetsData, IEqualizerPreset, IEqualizerPresetsInfo } from '../../models/equalizer.models';

const equalizerPresetsData: Promise<IEqualizerPresetsData> = import('../../../assets/winamp-presets/winamp-presets.json');

@Component({
  selector: 'app-equalizer',
  templateUrl: './equalizer.component.html',
  styleUrls: ['./equalizer.component.scss'],
})

export class EqualizerComponent implements OnInit, OnDestroy {
  isShown!: boolean;

  canvasWidth = window.innerWidth;

  @ViewChild('frequencyVisualizer', { static: true }) myCanvas!: ElementRef;

  private canvas!: HTMLCanvasElement;

  private canvasContext!: CanvasRenderingContext2D | null;

  private reqAnimFrameId = 0;

  equalizerPresets: IEqualizerPreset[] = [];

  frequencies = this.myAudio.frequencies;

  equalizerPresetsInfo!: IEqualizerPresetsInfo;

  constructor(
    private ngZone: NgZone,
    private myState: StateService,
    private myAudio: AudioService,
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
    });
    this.canvas = this.myCanvas.nativeElement;
    this.canvas.width = this.canvasWidth * (10 / 12);
    this.canvasContext = this.canvas.getContext('2d');

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

    ['pause', 'ended'].forEach((event) => {
      this.myAudio.audio.addEventListener(event, () => {
        this.stopEqualizerAnimation();
      });
    });

    window.addEventListener('resize', () => {
      this.canvasWidth = window.innerWidth;
    });
  }

  ngOnDestroy(): void {
    this.myState.isEqualizerShown$.unsubscribe();
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
      if (this.canvasContext) {
        this.canvasContext.fillStyle = '#ffffff';
      }

      let x = 0;
      for (let i = 0; i < bufferLength; i += 1) {
        const barPosition = x;
        const barWidth = 2;
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

  changeGain(audioFilterIndex: number, event: Event) {
    const gainSlider = event.currentTarget;
    if (gainSlider instanceof HTMLInputElement && Number(gainSlider.value)) {
      this.myAudio.setGainAudioFilter(audioFilterIndex, Number(gainSlider.value));
    }
  }
}
