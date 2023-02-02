import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { WelcomeComponent } from './welcome/welcome.component';

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
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    WelcomeComponent,
  ],
})
export class CoreModule { }
