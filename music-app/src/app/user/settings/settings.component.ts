import { Component, Inject } from '@angular/core';
import {
  L10nLocale,
  L10N_LOCALE,
  L10N_CONFIG,
  L10nConfig,
  L10nTranslationService,
} from 'angular-l10n';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  schema = this.l10nConfig.schema;

  constructor(
    @Inject(L10N_LOCALE) public locale: L10nLocale,
    @Inject(L10N_CONFIG) private l10nConfig: L10nConfig,
    private translation: L10nTranslationService,
  ) { }

  setLocale(locale: L10nLocale): void {
    this.translation.setLocale(locale);
  }
}
