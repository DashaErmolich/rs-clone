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

  themesCssClasses: string[] = this.themeService.themesCssClasses;

  themesTitles: string[] = this.themeService.themesTitles;

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

  isDarkTheme(): boolean {
    return this.themeService.isThemeDark;
  }

  isThemeChecked(theme: string): boolean {
    return this.themeService.activeThemeCssClass.split('-dark').join('') === theme;
  }
}
