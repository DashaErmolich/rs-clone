import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  declarations: [
    SignInComponent,
    SignUpComponent,
    SettingsComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    SignInComponent,
    SignUpComponent,
    SettingsComponent,
  ],
})
export class UserModule { }
