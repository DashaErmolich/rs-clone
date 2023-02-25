import { Component } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { StateService } from './services/state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent {
  title = 'music-app';

  isAuthorized!: boolean;

  constructor(
    private myTheme: ThemeService,
    private myState: StateService,
  ) {}

  getClass() {
    return this.myTheme.activeCssClass$;
  }

  getStartClass() {
    this.myTheme.setOverlayContainerTheme();
    return this.myTheme.activeThemeCssClass;
  }
}
