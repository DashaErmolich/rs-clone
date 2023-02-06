import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { L10nTranslationModule, L10nIntlModule } from 'angular-l10n';
import { CookieModule } from 'ngx-cookie';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SettingsComponent } from './settings/settings.component';
import { l10nConfig, HttpTranslationLoader, AppStorage } from '../I10n-config';

@NgModule({
  declarations: [
    SignInComponent,
    SignUpComponent,
    SettingsComponent,
  ],
  imports: [
    CommonModule,
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
    SignInComponent,
    SignUpComponent,
    SettingsComponent,
  ],
})
export class UserModule { }
