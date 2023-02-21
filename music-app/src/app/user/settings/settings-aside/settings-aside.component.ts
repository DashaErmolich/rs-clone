import { Component, Input } from '@angular/core';
import { StateService } from '../../../services/state.service';

@Component({
  selector: 'app-settings-aside',
  templateUrl: './settings-aside.component.html',
  styleUrls: ['./settings-aside.component.scss'],
})
export class SettingsAsideComponent {
  @Input() isSettingsMenuShown!: boolean;

  constructor(
    private myState: StateService,
  ) { }

  toggleSettingsMenuVisibility() {
    if (this.isSettingsMenuShown) {
      this.myState.setSettingsMenuVisibility(!this.isSettingsMenuShown);
    }
  }
}
