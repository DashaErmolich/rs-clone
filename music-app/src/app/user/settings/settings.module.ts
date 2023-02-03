import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SettingsAsideComponent } from './settings-aside/settings-aside.component';
import { SettingsLanguageComponent } from './settings-language/settings-language.component';
import { SettingsThemeComponent } from './settings-theme/settings-theme.component';
import { SettingsAccountComponent } from './settings-account/settings-account.component';
import { SettingsPageComponent } from './settings-page/settings-page.component';

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
  ],
  exports: [
    SettingsPageComponent,
  ],
})
export class SettingsModule { }
