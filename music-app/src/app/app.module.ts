import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { MusicModule } from './music/music.module';
import { UserModule } from './user/user.module';
import { AuthorizedGuard } from './guards/isAuthorized.guard'; 
import { StateService } from './core/services/state.service';
import { AuthorizationApiService } from './services/authorization-api.service';

function initializeApp(): Promise<void> {
  return new Promise((resolve, reject) => { 
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
  ],
  providers: [
    AuthorizedGuard,
    {
      provide: APP_INITIALIZER,
      useFactory: () => initializeApp,
      multi: true
     }
  ],
  bootstrap: [AppComponent],
})
export default class AppModule {}
