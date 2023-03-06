import { Component, Input } from '@angular/core';

import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss'],
})
export class AsideComponent {
  @Input() isNavigationMenuShown!: boolean;

  constructor(
    private myState: StateService,
  ) { }

  toggleNavigationMenuVisibility() {
    if (this.isNavigationMenuShown) {
      this.myState.setNavigationMenuVisibility(!this.isNavigationMenuShown);
    }
  }
}
