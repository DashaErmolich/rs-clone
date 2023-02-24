import { Component } from '@angular/core';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent {
  title = 'music-app';
  isAuthorized!: boolean;

  constructor(
    private themeService: ThemeService,
  ) {}

  getClass() {
    return this.themeService.activeCssClass$;
  }

  getStartClass() {
    this.themeService.setOverlayContainerTheme();
    return this.themeService.activeThemeCssClass;
  }
}
