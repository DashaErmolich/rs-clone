import { Component } from '@angular/core';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent {
  title = 'music-app';

  constructor(
    private themeService: ThemeService,
  ) {
    this.themeService.setActiveTheme(this.themeService.themes[0], true);
  }

  getClass() {
    return this.themeService.activeCssClass$;
  }
}
