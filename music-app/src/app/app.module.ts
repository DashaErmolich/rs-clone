import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { MusicModule } from './music/music.module';
import { UserModule } from './user/user.module';
import { ThemeService } from './core/services/theme.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    CoreModule,
    MusicModule,
    UserModule,
    HttpClientModule,
  ],
  providers: [
    ThemeService,
  ],
  bootstrap: [AppComponent],
})
export default class AppModule {}
