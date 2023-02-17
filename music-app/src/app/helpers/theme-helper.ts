import { Directive } from '@angular/core';

import { ThemeService } from '../services/theme.service';

@Directive()

export class ThemeHelper {
  theme: string = this.myTheme.activeTheme;

  constructor(
    private myTheme: ThemeService,
  ) { }
}
