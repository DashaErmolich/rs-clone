import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { L10nTranslationModule, L10nIntlModule } from 'angular-l10n';
import { CookieModule } from 'ngx-cookie';
import { WelcomeComponent } from './welcome/welcome.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { L10nTranslationModule, L10nIntlModule, } from 'angular-l10n';
import { CookieModule } from 'ngx-cookie';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    WelcomeComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    L10nTranslationModule,
    L10nIntlModule,
    CookieModule.withOptions(),
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    WelcomeComponent,
  ],
})
export class CoreModule { }
