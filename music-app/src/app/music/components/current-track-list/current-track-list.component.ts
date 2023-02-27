import {
  Component, Input, OnInit, OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ITrackResponse } from '../../../models/api-response.models';
import { StateService } from '../../../services/state.service';

@Component({
  selector: 'app-current-track-list',
  templateUrl: './current-track-list.component.html',
  styleUrls: ['./current-track-list.component.scss'],
})

export class CurrentTrackListComponent implements OnInit, OnDestroy {
  @Input() isSmall!: boolean;

  @Input() isHandset!: boolean;

  @Input() isExtraSmall!: boolean;

  @Input() trackList!: Partial<ITrackResponse>[];

  @Input() activeTrackImageSrc!: string;

  @Input() activeTrackTitle!: string;

  @Input() activeTrackArtist!: string;

  @Input() activeTrackArtistID!: number;

  routerEventSubscription = new Subscription();

  constructor(
    private myState: StateService,
    private myRouter: Router,
  ) { }

  ngOnInit(): void {
    this.routerEventSubscription = this.myRouter.events.subscribe(() => {
      this.myState.setCurrentTrackListVisibility(false);
    });
  }

  ngOnDestroy(): void {
    this.routerEventSubscription.unsubscribe();
  }
}
