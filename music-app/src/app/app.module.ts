import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { MusicModule } from './music/music.module';
import { UserModule } from './user/user.module';
import { ProgressLoaderInterceptor } from './interceptors/progress-loader.interceptor';

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
    MatSidenavModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: ProgressLoaderInterceptor, multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export default class AppModule {}
