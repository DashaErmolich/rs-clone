import { AfterContentChecked, Component } from '@angular/core';

import { Observable } from 'rxjs';

import { ThemeService } from '../../../core/services/theme.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';

@Component({
  selector: 'app-settings-theme',
  templateUrl: './settings-theme.component.html',
  styleUrls: ['./settings-theme.component.scss'],
})
export class SettingsThemeComponent implements AfterContentChecked {
  isDarkTheme: Observable<boolean> | undefined;

  constructor(
    private themeService: ThemeService,
    private localStorage: LocalStorageService,
  ) { }

  ngAfterContentChecked(): void {
    this.themeService.checkTheme();
    this.isDarkTheme = this.themeService.isDarkTheme;
  }

  toggleDarkTheme(checked: boolean) {
    this.themeService.setDarkTheme(checked);
    this.localStorage.setTheme(checked ? 'dark' : 'light');
  }
}
