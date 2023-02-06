import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { L10nTranslationModule, L10nIntlModule } from 'angular-l10n';
import { CookieModule } from 'ngx-cookie';
import { SettingsAsideComponent } from './settings-aside/settings-aside.component';
import { SettingsLanguageComponent } from './settings-language/settings-language.component';
import { SettingsThemeComponent } from './settings-theme/settings-theme.component';
import { SettingsAccountComponent } from './settings-account/settings-account.component';
import { SettingsPageComponent } from './settings-page/settings-page.component';
import { ThemeService } from '../../core/services/theme.service';
import { l10nConfig, HttpTranslationLoader, AppStorage } from '../../I10n-config';

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
        storage: AppStorage,
      },
    ),
    L10nIntlModule,
    CookieModule.withOptions(),
  ],
  exports: [
    SettingsPageComponent,
  ],
  providers: [
    ThemeService,
  ],
})
export class SettingsModule { }
