import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { L10nTranslationModule, L10nIntlModule } from 'angular-l10n';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { NotFoundComponent } from '../core/not-found/not-found.component';
import { LibraryComponent } from './library/library.component';
import { HomeComponent } from './home/home.component';
import { AsideComponent } from './aside/aside.component';
import { PlayerComponent } from './player/player.component';
// import { SearchComponent } from './search/search.component';
import { MusicPageComponent } from './music-page/music-page.component';
import { PlayListComponent } from './play-list/play-list.component';
// import { GenreComponent } from './genre/genre.component';
// import { ArtistComponent } from './artist/artist.component';

@NgModule({
  declarations: [
    NotFoundComponent,
    LibraryComponent,
    HomeComponent,
    AsideComponent,
    PlayerComponent,
    // SearchComponent,
    MusicPageComponent,
    PlayListComponent,
    // GenreComponent,
    // ArtistComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatSidenavModule,
    L10nTranslationModule,
    L10nIntlModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatInputModule,
    MatChipsModule,
    MatGridListModule,
  ],
  exports: [
    MusicPageComponent,
    HomeComponent,
    MatInputModule,
  ],
})
export class MusicModule { }
