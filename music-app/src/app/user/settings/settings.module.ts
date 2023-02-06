import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { L10nTranslationModule, L10nIntlModule } from 'angular-l10n';

import { SettingsAsideComponent } from './settings-aside/settings-aside.component';
import { SettingsLanguageComponent } from './settings-language/settings-language.component';
import { SettingsThemeComponent } from './settings-theme/settings-theme.component';
import { SettingsAccountComponent } from './settings-account/settings-account.component';
import { SettingsPageComponent } from './settings-page/settings-page.component';
import { l10nConfig, HttpTranslationLoader } from '../../I10n-config';
import { ThemeService } from '../../core/services/theme.service';
import { LocalStorageService } from '../../core/services/local-storage.service';

@NgModule({
  declarations: [
    SettingsAsideComponent,
    SettingsLanguageComponent,
    SettingsThemeComponent,
    SettingsAccountComponent,
    SettingsPageComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatSlideToggleModule,
    L10nTranslationModule.forRoot(
      l10nConfig,
      {
        translationLoader: HttpTranslationLoader,
      },
    ),
    L10nIntlModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    SettingsPageComponent,
  ],
  providers: [
    ThemeService,
    LocalStorageService,
  ],
})
export class SettingsModule { }