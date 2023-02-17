import { Component, OnInit } from '@angular/core';
import { DeezerRestApiService } from '../../services/deezer-api.service';
import { ITrackResponse } from '../../models/api-response.models';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-liked-tracks',
  templateUrl: './liked-tracks.component.html',
  styleUrls: ['./liked-tracks.component.scss'],
})
export class LikedTracksComponent implements OnInit {
  trackList: Partial<ITrackResponse>[] = [];

  constructor(
    private myDeezer: DeezerRestApiService,
    private myState: StateService,
  ) { }

  ngOnInit(): void {
    this.myState.likedTracks$.subscribe((likedTracks) => {
      this.trackList = [];
      likedTracks.forEach((trackId) => {
        this.myDeezer.getTrack(trackId).subscribe((res) => {
          this.trackList.push(res);
        });
      });
    });
  }
}
