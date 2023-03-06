import {
  Component, Input, OnInit, OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ICustomPlaylistModel } from '../../../models/user-model.models';
import { StateService } from '../../../services/state.service';

@Component({
  selector: 'app-created-playlists',
  templateUrl: './created-playlists.component.html',
})

export class CreatedPlaylistsComponent implements OnInit, OnDestroy {
  @Input() isSmall!: boolean;

  @Input() isHandset!: boolean;

  @Input() isExtraSmall!: boolean;

  customPlaylistsSubscription = new Subscription();

  customPlaylists!: ICustomPlaylistModel[];

  constructor(
    private myState: StateService,
  ) { }

  ngOnInit(): void {
    this.customPlaylistsSubscription = this.myState.customPlaylists$.subscribe((response) => {
      this.customPlaylists = response;
    });
  }

  ngOnDestroy(): void {
    this.customPlaylistsSubscription.unsubscribe();
  }
}
