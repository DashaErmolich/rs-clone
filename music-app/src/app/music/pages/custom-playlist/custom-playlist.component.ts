import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { DeezerRestApiService } from '../../../services/deezer-api.service';
import { ITrackResponse } from '../../../models/api-response.models';
import { ResponsiveService } from '../../../services/responsive.service';

@Component({
  selector: 'app-custom-playlist',
  templateUrl: './custom-playlist.component.html',
  styleUrls: ['./custom-playlist.component.scss'],
})
export class CustomPlaylistComponent implements OnInit, OnDestroy {
  playListName = 'My playlist';

  tracks: Partial<ITrackResponse>[] = [];

  subscriptions: Subscription[] = [];

  isSmall = false;

  isHandset = false;

  isExtraSmall = false;

  isSmall$ = new Subscription();

  isHandset$ = new Subscription();

  isExtraSmall$ = new Subscription();

  customPlaylistTracks: number[] = [];

  searchControlSubscription = new Subscription();

  searchControl: FormControl = new FormControl();

  nameControl: FormControl = new FormControl();

  searchValue = '';

  searchSubscription = new Subscription();

  nameSubscription = new Subscription();

  searchTracksSubscription = new Subscription();

  isLoading = true;

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

    this.searchControlSubscription = this.searchControl.valueChanges
      .subscribe((res) => {
        this.isLoading = true;
        this.searchValue = res;
        this.getSearch();
        this.isLoading = false;
      });

    this.nameSubscription = this.nameControl.valueChanges
      .subscribe((res) => {
        this.playListName = res;
        console.log(this.playListName);
      });
  }

  ngOnDestroy(): void {
    this.searchControlSubscription.unsubscribe();
    this.searchSubscription.unsubscribe();
    this.searchTracksSubscription.unsubscribe();
    this.nameSubscription.unsubscribe();
  }

  getSearch() {
    this.searchSubscription = this.myDeezer
      .getSearch(this.searchValue, 0, 5).subscribe((response) => {
        this.tracks = [];
        try {
          const foundTracks = response.data.length
            ? response.data.filter((item) => item.id !== undefined)
            : [];
          if (foundTracks.length) {
            this.tracks = foundTracks;
          }
        } catch (error) { /* empty */ }
      });
  }

  saveCustomPlayList() {
    console.log(this.playListName);
    console.log(this.customPlaylistTracks);
  }
}
