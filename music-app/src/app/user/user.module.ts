import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { L10nTranslationModule, L10nIntlModule } from 'angular-l10n';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SettingsComponent } from './settings/settings.component';
import { l10nConfig, HttpTranslationLoader } from '../I10n-config';

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
      },
    ),
    L10nIntlModule,
  ],
  exports: [
    SignInComponent,
    SignUpComponent,
    SettingsComponent,
  ],
})
export class UserModule { }
