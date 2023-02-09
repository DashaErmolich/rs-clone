/* eslint-disable class-methods-use-this */
import { Injectable } from '@angular/core';
import { IUserTheme } from '../../models/theme.models';

@Injectable({
  providedIn: 'root',
})

export class LocalStorageService {
  setLanguage(language: string): void {
    localStorage.setItem('lang', language);
  }

  getLanguage(): string | null {
    return localStorage.getItem('lang');
  }

  setTheme(theme: string, darkness: boolean): void {
    const userTheme: IUserTheme = {
      cssClass: theme,
      isDark: darkness,
    };

    localStorage.setItem('theme', JSON.stringify(userTheme));
  }

  getTheme(): IUserTheme {
    const userTheme = localStorage.getItem('theme');
    return userTheme === null ? null : JSON.parse(userTheme);
  }
}
