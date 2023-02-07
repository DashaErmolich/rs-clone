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

  constructor(
    private localStorage: LocalStorageService,
  ) {
    this.activeThemeCssClass = this.getUserTheme().cssClass;
    this.isThemeDark = this.getUserTheme().isDark;
  }

  activeTheme: string = '';

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

    const cssClass = isDark === true ? theme + THEME_DARKNESS_SUFFIX : theme;

    this.activeThemeCssClass = cssClass;
    this.setActiveCssClass(cssClass);
    this.localStorage.setTheme(this.activeThemeCssClass, isDark);
  }

  toggleDarkness() {
    this.setActiveTheme(this.activeTheme, !this.isThemeDark);
  }

  setActiveCssClass(value: string): void {
    this.activeCssClass.next(value);
  }

  getUserTheme(): IUserTheme {
    const userTheme = this.localStorage.getTheme();
    const defaultTheme: IUserTheme = {
      cssClass: this.themes[0],
      isDark: true,
    };
    return userTheme === null ? defaultTheme : userTheme;
  }
}
