import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DeezerRestApiService } from '../../../services/deezer-api.service';
import { ITrackResponse } from '../../../models/api-response.models';
import { ResponsiveService } from '../../../services/responsive.service';

@Component({
  selector: 'app-custom-playlist',
  templateUrl: './custom-playlist.component.html',
  styleUrls: ['./custom-playlist.component.scss'],
})
export class CustomPlaylistComponent implements OnInit {
  value = 'My playlist';

  tracks: ITrackResponse[] = [];

  subscriptions: Subscription[] = [];

  isSmall = false;

  isHandset = false;

  isExtraSmall = false;

  isSmall$ = new Subscription();

  isHandset$ = new Subscription();

  isExtraSmall$ = new Subscription();

  customPlaylistTracks: ITrackResponse[] = [];

  constructor(
    private myDeezer: DeezerRestApiService,
    private responsive: ResponsiveService,
  ) { }

  ngOnInit(): void {
    this.isSmall$ = this.responsive.isSmall$.subscribe((data) => {
      this.isSmall = data;
    });
    this.subscriptions.push(this.isSmall$);
    this.isHandset$ = this.responsive.isHandset$.subscribe((data) => {
      this.isHandset = data;
    });
    this.subscriptions.push(this.isHandset$);
    this.isExtraSmall$ = this.responsive.isExtraSmall$.subscribe((data) => {
      this.isExtraSmall = data;
    });
    this.subscriptions.push(this.isSmall$);
    this.subscriptions.push(this.isHandset$);
    this.subscriptions.push(this.isExtraSmall$);
  }

  getSearch(eventTarget: EventTarget | null) {
    // eslint-disable-next-line max-len
    this.myDeezer.getSearch((eventTarget as HTMLInputElement).value, 0, 50).subscribe((response) => {
      response.data.forEach((track) => {
        this.myDeezer.getTrack(track.id!).subscribe((data) => {
          this.tracks.push(data);
        });
      });
      console.log(response.data);
    });
  }

  saveCustomPlayList() {
    console.log(this.customPlaylistTracks);
  }
}
