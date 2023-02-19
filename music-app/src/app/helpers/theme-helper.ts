import { Directive } from '@angular/core';

import { ThemeService } from '../services/theme.service';

@Directive()

export class ThemeHelper {
  theme: string = this.myTheme.activeTheme;

  constructor(
    private myTheme: ThemeService,
  ) {
  }

  getLogoIconPath(): string {
    return this.myTheme.isThemeDark
      ? '../../../assets/icons/sprite.svg#app-logo-large'
      : '../../../assets/icons/sprite.svg#app-logo-large-dark';
  }
}
