import {
  Component, Input,
} from '@angular/core';
import { Router } from '@angular/router';

import { StateService } from '../../../services/state.service';
import { AudioService } from '../../../services/audio.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-current-track-list',
  templateUrl: './current-track-list.component.html',
  styleUrls: ['./current-track-list.component.scss'],
})

export class CurrentTrackListComponent {
  @Input() isSmall!: boolean;

  @Input() isHandset!: boolean;

  @Input() isExtraSmall!: boolean;

  @Input() isShown!: boolean;

  constructor(
    private myState: StateService,
    private myAudio: AudioService,
    private myStorage: LocalStorageService,
    private myTheme: ThemeService,
    private myRouter: Router,
  ) {
  }
}
