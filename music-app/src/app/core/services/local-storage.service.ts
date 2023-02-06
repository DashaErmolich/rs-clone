/* eslint-disable class-methods-use-this */
import { Injectable } from '@angular/core';

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

  setTheme(theme: string): void {
    localStorage.setItem('theme', theme);
  }

  getTheme(): string | null {
    return localStorage.getItem('theme');
  }
}
