import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { MusicModule } from './music/music.module';
import { UserModule } from './user/user.module';
import { ProgressLoaderInterceptor } from './interceptors/progress-loader.interceptor';
import { AuthorizedGuard } from './guards/isAuthorized.guard';

function initializeApp(): Promise<void> {
  return new Promise((resolve) => {
    resolve();
  });
}

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
    MatSnackBarModule,
  ],
  providers: [
    MatSnackBarModule,
    {
      provide: HTTP_INTERCEPTORS, useClass: ProgressLoaderInterceptor, multi: true,
    },
    AuthorizedGuard,
    {
      provide: APP_INITIALIZER,
      useFactory: () => initializeApp,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export default class AppModule {}
