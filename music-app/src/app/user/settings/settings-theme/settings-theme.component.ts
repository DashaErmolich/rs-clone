import { Component } from '@angular/core';

import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-settings-theme',
  templateUrl: './settings-theme.component.html',
  styleUrls: ['./settings-theme.component.scss'],
})

export class SettingsThemeComponent {
  constructor(
    private themeService: ThemeService,
  ) { }

  themes: string[] = this.themeService.themes;

  setActiveTheme(theme: string, darkness: boolean | null = null) {
    this.themeService.setActiveTheme(theme, darkness);
  }

  toggleDarkness() {
    this.themeService.toggleDarkness();
  }

  // eslint-disable-next-line class-methods-use-this
  getThemeName(theme: string): string {
    return theme.split('-').join(' ');
  }
}
