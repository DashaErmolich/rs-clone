import { Component, Inject, OnInit } from '@angular/core';

import {
  L10N_CONFIG,
  L10N_LOCALE,
  L10nLocale,
  L10nConfig,
  L10nTranslationService,
} from 'angular-l10n';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';

@Component({
  selector: 'app-settings-language',
  templateUrl: './settings-language.component.html',
  styleUrls: ['./settings-language.component.scss'],
})

export class SettingsLanguageComponent implements OnInit {
  schema = this.l10nConfig.schema;

  constructor(
    @Inject(L10N_LOCALE) public locale: L10nLocale,
    @Inject(L10N_CONFIG) private l10nConfig: L10nConfig,
    private translation: L10nTranslationService,
    private localStorage: LocalStorageService,
  ) { }

  ngOnInit(): void {
    const lang = this.localStorage.getLanguage();

    if (lang === null) {
      this.localStorage.setLanguage(this.locale.language);
    } else {
      const currentLocale: L10nLocale = {
        language: lang,
      };
      this.translation.setLocale(currentLocale);
    }
  }

  setLocale(locale: L10nLocale): void {
    this.translation.setLocale(locale);
    this.localStorage.setLanguage(this.locale.language);
  }

  isChecked(value: string): boolean {
    return value === this.locale.language;
  }
}
