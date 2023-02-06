import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { SettingsPageComponent } from './settings/settings-page/settings-page.component';
import { SettingsModule } from './settings/settings.module';
import { SignUpComponent } from './sign-up/sign-up.component';

@NgModule({
  declarations: [
    SignInComponent,
    SignUpComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SettingsModule,
  ],
  exports: [
    SignInComponent,
    SignUpComponent,
    SettingsPageComponent,
  ],
})
export class UserModule { }
