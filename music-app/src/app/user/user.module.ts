import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignInComponent } from './sign-in/sign-in.component';
import { SettingsPageComponent } from './settings/settings-page/settings-page.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { L10nIntlModule, L10nTranslationModule } from 'angular-l10n';
import { AppStorage, HttpTranslationLoader, l10nConfig } from '../I10n-config';
import { CookieModule } from 'ngx-cookie';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { AuthInterceptor } from '../interceptors/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ResponseInterceptor } from '../interceptors/responce.interceptor';

import { SettingsModule } from './settings/settings.module';

@NgModule({
  declarations: [
    SignInComponent,
    SignUpComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SettingsModule,
    ReactiveFormsModule,
    FormsModule,
    L10nTranslationModule.forRoot(
      l10nConfig,
      {
        translationLoader: HttpTranslationLoader,
        storage: AppStorage,
      },
    ),
    CookieModule.withOptions(),
    L10nIntlModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [
    SignInComponent,
    SignUpComponent,
    SettingsPageComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ResponseInterceptor,
      multi: true,
    },
    

  ],
})
export class UserModule { }
