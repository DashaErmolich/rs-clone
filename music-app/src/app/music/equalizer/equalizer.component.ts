/* eslint-disable no-debugger */
/* eslint-disable object-curly-newline */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { StateService } from 'src/app/core/services/state.service';
import { AudioService } from '../../core/services/audio.service';

@Component({
  selector: 'app-equalizer',
  templateUrl: './equalizer.component.html',
  styleUrls: ['./equalizer.component.scss'],
})
export class EqualizerComponent implements OnInit {
  isShown!: boolean;

  @ViewChild('canvas', { static: true }) myCanvas!: ElementRef;

  @ViewChild('player', { static: true }) player!: ElementRef;

  private canvas!: HTMLCanvasElement;

  private canvasContext!: CanvasRenderingContext2D | null;

  private reqAnimFrameId = 0;

  private isPlayed = false;

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
    this.canvas = this.myCanvas.nativeElement;
    this.canvasContext = this.canvas.getContext('2d');
    this.player.nativeElement.appendChild(this.myAudio.audio);

    this.ngZone.runOutsideAngular(() => {
      this.startEqualizerAnimation();
    });

    this.myAudio.audio.addEventListener('play', () => {
      this.isPlayed = true;
      this.startEqualizerAnimation();
    });

    ['pause', 'ended'].forEach((element) => {
      this.myAudio.audio.addEventListener(element, () => {
        this.isPlayed = false;
        this.stopEqualizerAnimation();
      });
    });
  }

  startEqualizerAnimation() {
    if (this.myAudio.analyser) {
      this.myAudio.analyser.fftSize = 2048;
      const fbc_array = new Uint8Array(this.myAudio.analyser.frequencyBinCount);
      const bar_count = window.innerWidth / 2;

      this.myAudio.analyser.getByteFrequencyData(fbc_array);

      this.canvasContext?.clearRect(
        0,
        0,
        this.canvas.width,
        this.canvas.height,
      );
      if (this.canvasContext) this.canvasContext.fillStyle = '#ffffff';

      for (let i = 0; i < bar_count; i++) {
        const bar_pos = i * 3;
        const bar_width = 2;
        const bar_height = -(fbc_array[i] / 2);

        this.canvasContext?.fillRect(
          bar_pos,
          this.canvas.height,
          bar_width,
          bar_height,
        );
      }

      this.reqAnimFrameId = window.requestAnimationFrame(
        this.startEqualizerAnimation.bind(this),
      );
    }
  }

  stopEqualizerAnimation() {
    setTimeout(() => {
      window.cancelAnimationFrame(this.reqAnimFrameId);
    }, 500);
  }
}
