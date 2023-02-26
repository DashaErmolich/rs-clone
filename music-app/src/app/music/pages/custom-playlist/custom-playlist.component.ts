/* eslint-disable import/no-extraneous-dependencies */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { Router } from '@angular/router';
import { DeezerRestApiService } from '../../../services/deezer-api.service';
import { ITrackResponse } from '../../../models/api-response.models';
import { ResponsiveService } from '../../../services/responsive.service';
import { ICustomPlaylistModel } from '../../../models/user-model.models';
import { StateService } from '../../../services/state.service';
import { Limits } from '../../../enums/endpoints';

const DEFAULT_PLAYLIST_NAME = 'My playlist';

@Component({
  selector: 'app-custom-playlist',
  templateUrl: './custom-playlist.component.html',
  styleUrls: ['./custom-playlist.component.scss'],
})
export class CustomPlaylistComponent implements OnInit, OnDestroy {
  playListName = DEFAULT_PLAYLIST_NAME;

  tracks: Partial<ITrackResponse>[] = [];

  subscriptions: Subscription[] = [];

  isSmall = false;

  isHandset = false;

  isExtraSmall = false;

  isSmallSubscription = new Subscription();

  isHandsetSubscription = new Subscription();

  isExtraSmallSubscription = new Subscription();

  customPlaylistTracks: number[] = [];

  searchControlSubscription = new Subscription();

  searchControl: FormControl = new FormControl();

  nameControl: FormControl = new FormControl(
    this.playListName,
    [
      Validators.required,
      Validators.maxLength(20),
    ],
  );

  searchValue = '';

  searchSubscription = new Subscription();

  nameSubscription = new Subscription();

  isLoading = true;

  limitTracks: number = Limits.tracks;

  index = 0;

  constructor(
    private myDeezer: DeezerRestApiService,
    private responsive: ResponsiveService,
    private myState: StateService,
    private myRouter: Router,
  ) { }

  ngOnInit(): void {
    this.isSmallSubscription = this.responsive.isSmall$.subscribe((data) => {
      this.isSmall = data;
    });

    this.subscriptions.push(this.isSmallSubscription);

    this.isHandsetSubscription = this.responsive.isHandset$.subscribe((data) => {
      this.isHandset = data;
    });

    this.subscriptions.push(this.isHandsetSubscription);

    this.isExtraSmallSubscription = this.responsive.isExtraSmall$.subscribe((data) => {
      this.isExtraSmall = data;
    });

    this.subscriptions.push(this.isExtraSmallSubscription);

    this.searchControlSubscription = this.searchControl.valueChanges
      .subscribe((res) => {
        this.isLoading = true;
        this.searchValue = res;
        this.getSearch();
        this.isLoading = false;
      });

    this.subscriptions.push(this.searchControlSubscription);

    this.nameSubscription = this.nameControl.valueChanges
      .subscribe((res) => {
        this.playListName = res;
      });

    this.subscriptions.push(this.nameSubscription);
    this.subscriptions.push(this.searchSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getSearch() {
    this.searchSubscription = this.myDeezer
      .getSearch(this.searchValue, this.index, this.limitTracks).subscribe((response) => {
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
    const playlist: ICustomPlaylistModel = {
      id: Guid.create().toString(),
      title: this.playListName,
      creator: {
        name: this.myState.userName$.value,
      },
      tracks: {
        data: this.customPlaylistTracks,
      },
      nb_tracks: this.customPlaylistTracks.length,
    };
    this.myState.setCustomPlaylist(playlist);
    this.playListName = DEFAULT_PLAYLIST_NAME;
    this.searchControl.setValue('');
    this.customPlaylistTracks = [];
    this.myRouter.navigate([`music/user-play-list/${playlist.id}`]);
  }

  getMore() {
    this.limitTracks += Limits.tracks;
    this.getSearch();
  }
}
