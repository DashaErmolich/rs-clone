import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})

export class ThemeService {
  private darkTheme = new Subject<boolean>();

  constructor(private localStorage: LocalStorageService) {

  }

  isDarkTheme = this.darkTheme.asObservable();

  setDarkTheme(isDarkTheme: boolean): void {
    this.darkTheme.next(isDarkTheme);
  }

  checkTheme(): void {
    const theme = this.localStorage.getTheme();

    if (theme === null) {
      this.localStorage.setTheme('dark');
      this.setDarkTheme(true);
    } else {
      this.setDarkTheme(theme === 'dark');
    }
  }
}
