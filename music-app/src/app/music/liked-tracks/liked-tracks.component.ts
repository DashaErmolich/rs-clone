import { Component, OnInit } from '@angular/core';
import { DeezerRestApiService } from '../../services/deezer-api.service';
import { ITrackResponse } from '../../models/api-response.models';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-liked-tracks',
  templateUrl: './liked-tracks.component.html',
  styleUrls: ['./liked-tracks.component.scss'],
})
export class LikedTracksComponent implements OnInit {
  trackList!: Partial<ITrackResponse>[];

  constructor(
    private myStorage: LocalStorageService,
  ) { }

  ngOnInit(): void {
    this.myStorage.getLikedTracks();
  }
}
