import {
  Component,
  OnInit,
  OnDestroy,
  Input,
} from '@angular/core';

import { Subscription } from 'rxjs';

import { DeezerRestApiService } from '../../../services/deezer-api.service';
import { ITrackResponse } from '../../../models/api-response.models';
import { StateService } from '../../../services/state.service';

@Component({
  selector: 'app-liked-tracks',
  templateUrl: './liked-tracks.component.html',
  styleUrls: ['./liked-tracks.component.scss'],
})
export class LikedTracksComponent implements OnInit, OnDestroy {
  @Input() isSmall!: boolean;

  @Input() isHandset!: boolean;

  @Input() isExtraSmall!: boolean;

  trackList: Partial<ITrackResponse>[] = [];

  trackList$ = new Subscription();

  likedTracks$ = new Subscription();

  constructor(
    private myDeezer: DeezerRestApiService,
    private myState: StateService,
  ) { }

  ngOnInit(): void {
    this.likedTracks$ = this.myState.likedTracks$.subscribe((likedTracks) => {
      this.trackList = [];
      likedTracks.forEach((trackId) => {
        this.trackList$ = this.myDeezer.getTrack(trackId).subscribe((res) => {
          this.trackList.push(res);
        });
      });
    });
  }

  ngOnDestroy(): void {
    this.likedTracks$.unsubscribe();
    this.trackList$.unsubscribe();
  }
}
