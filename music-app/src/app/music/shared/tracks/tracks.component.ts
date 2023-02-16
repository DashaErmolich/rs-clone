import {
  Component, Input, OnInit, OnDestroy,
} from '@angular/core';

import { Subscription, Observable } from 'rxjs';

import { ITrackResponse } from '../../../models/api-response.models';
import { StateService } from '../../../services/state.service';
import { AudioService } from '../../../services/audio.service';
import { ThemeService } from '../../../services/theme.service';
import { DEFAULT_SRC } from '../../../constants/constants';

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.component.html',
  styleUrls: ['../../search/search.component.scss'],
})

export class TracksComponent implements OnInit, OnDestroy {
  defaultImg: string = DEFAULT_SRC;

  @Input() tracks: Partial<ITrackResponse>[] = [];

  tracksOfState: Partial<ITrackResponse>[] = [];

  theme: string = this.myTheme.activeTheme;

  playingTrackIndex$!: Subscription;

  trackList$!: Subscription;

  playingTrackIndex!: number;

  isPlay$!: Observable<boolean>;

  isPause$!: Observable<boolean>;

  isEnd$!: Subscription;

  isPlay!: boolean;

  isPause!: boolean;

  isEnd!: boolean;

  constructor(
    private myState: StateService,
    private myAudio: AudioService,
    private myTheme: ThemeService,
  ) { }

  ngOnInit(): void {
    this.playingTrackIndex$ = this.myState.playingTrackIndex$.subscribe((index) => {
      this.playingTrackIndex = index!;
    });
    this.isPlay$ = this.myAudio.isPlay$;
    this.isPause$ = this.myAudio.isPause$;
    this.isEnd$ = this.myAudio.state$.subscribe((res) => {
      if (res.progress !== res.duration) {
        this.isEnd = false;
      } else {
        this.isEnd = true;
      }
    });
    this.trackList$ = this.myState.trackList$.subscribe((tracks) => {
      this.tracksOfState = tracks;
    });
  }

  ngOnDestroy(): void {
    if (this.playingTrackIndex$) this.playingTrackIndex$.unsubscribe();
    if (this.isEnd$) this.isEnd$.unsubscribe();
    if (this.trackList$) this.trackList$.unsubscribe();
  }

  isTrackPlaying(trackIndex: number) {
    return this.tracksOfState.length
      ? this.tracks[trackIndex].id === this.tracksOfState[this.playingTrackIndex].id : false;
  }

  setTracksInfo(trackIndex: number) {
    this.myState.setTrackListInfo(this.tracks, trackIndex);
    this.myAudio.playTrack(String(this.tracksOfState[trackIndex].preview));
    this.isPlay = !this.isPlay;
  }

  playPause() {
    this.myAudio.isPlay$.subscribe((res) => { this.isPlay = res; });
    if (this.isPlay) {
      this.myAudio.pause();
    } else {
      this.myAudio.play();
    }
  }
}
