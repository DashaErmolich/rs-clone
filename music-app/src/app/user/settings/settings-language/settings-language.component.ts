import { Component, Inject } from '@angular/core';

import {
  L10N_CONFIG,
  L10N_LOCALE,
  L10nLocale,
  L10nConfig,
  L10nTranslationService,
} from 'angular-l10n';

@Component({
  selector: 'app-settings-language',
  templateUrl: './settings-language.component.html',
  styleUrls: ['./settings-language.component.scss'],
})

export class SettingsLanguageComponent {
  schema = this.l10nConfig.schema;

  constructor(
    @Inject(L10N_LOCALE) public locale: L10nLocale,
    @Inject(L10N_CONFIG) private l10nConfig: L10nConfig,
    private translation: L10nTranslationService,
  ) { }

  setLocale(locale: L10nLocale): void {
    this.translation.setLocale(locale);
  }

  isChecked(value: string): boolean {
    return value === this.locale.language;
  }
}
