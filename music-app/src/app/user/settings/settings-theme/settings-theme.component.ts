import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-settings-theme',
  templateUrl: './settings-theme.component.html',
  styleUrls: ['./settings-theme.component.scss'],
})

export class SettingsThemeComponent {
  isDarkTheme: Observable<boolean> | undefined;

  themes: string[] = this.themeService.themes;

  constructor(
    private themeService: ThemeService,
  ) { }

  setActiveTheme(theme: string, darkness: boolean | null = null) {
    this.themeService.setActiveTheme(theme, darkness);
  }

  toggleDarkness() {
    this.themeService.toggleDarkness();
  }
}
