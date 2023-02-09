import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { IUserTheme } from '../../models/theme.models';

const THEME_DARKNESS_SUFFIX = '-dark';

@Injectable({
  providedIn: 'root',
})

export class ThemeService {
  activeThemeCssClass: string;

  isThemeDark: boolean;

  private activeCssClass = new Subject<string>();

  activeCssClass$ = this.activeCssClass.asObservable();

  activeTheme: string;

  constructor(
    private localStorage: LocalStorageService,
  ) {
    this.activeThemeCssClass = this.getUserTheme().cssClass;
    this.isThemeDark = this.getUserTheme().isDark;
    this.activeTheme = this.getActiveTheme();
  }

  themes: string[] = [
    'deeppurple-amber',
    'indigo-pink',
    'pink-bluegrey',
    'purple-green',
  ];

  setActiveTheme(theme: string, darkness: boolean | null = null) {
    let isDark: boolean | null = darkness;

    if (isDark === null) {
      isDark = this.isThemeDark;
    } else if (this.isThemeDark === isDark) {
      if (this.activeTheme === theme) {
        return;
      }
    } else {
      this.isThemeDark = isDark;
    }

    this.activeTheme = theme;

    let cssClass = theme;

    if (isDark === true) {
      cssClass += THEME_DARKNESS_SUFFIX;
    }

    this.activeThemeCssClass = cssClass;
    this.setActiveCssClass(cssClass);
    this.localStorage.setTheme(this.activeThemeCssClass, isDark);
  }

  toggleDarkness() {
    this.setActiveTheme(this.activeTheme, !this.isThemeDark);
  }

  setActiveCssClass(chosenTheme: string): void {
    this.activeCssClass.next(chosenTheme);
  }

  getUserTheme(): IUserTheme {
    const userTheme = this.localStorage.getTheme();
    const defaultTheme: IUserTheme = {
      cssClass: this.themes[0] + THEME_DARKNESS_SUFFIX,
      isDark: true,
    };
    if (userTheme === null) {
      this.localStorage.setTheme(defaultTheme.cssClass, defaultTheme.isDark);
    }
    return userTheme === null ? defaultTheme : userTheme;
  }

  getActiveTheme(): string {
    return this.activeThemeCssClass.split(THEME_DARKNESS_SUFFIX).join('');
  }
}
