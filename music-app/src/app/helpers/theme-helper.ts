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
      ? '../../../assets/icons/sprite.svg#app-logo'
      : '../../../assets/icons/sprite.svg#app-logo-dark';
  }

  getColorClassName(type: string = 'primary'): string {
    return `${this.theme}-font-color theme-${type}`;
  }

  getRssLogoIconPath(): string {
    return this.myTheme.isThemeDark
      ? '../../assets/icons/rs_school_js.svg'
      : '../../assets/icons/rs_school_js_dark.svg';
  }
}
