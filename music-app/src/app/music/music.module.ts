import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';

import { L10nTranslationModule, L10nIntlModule } from 'angular-l10n';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';

import { MatFormFieldModule } from '@angular/material/form-field';
import { CookieModule } from 'ngx-cookie';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotFoundComponent } from '../core/not-found/not-found.component';
import { LibraryComponent } from './library/library.component';
import { HomeComponent } from './home/home.component';
import { AsideComponent } from './aside/aside.component';
import { PlayerComponent } from './player/player.component';
import { SearchComponent } from './search/search.component';
import { MusicPageComponent } from './music-page/music-page.component';
import { GenreComponent } from './genre/genre.component';
import { EqualizerComponent } from './equalizer/equalizer.component';
import { TracksComponent } from './shared/tracks/tracks.component';
import { ArtistsComponent } from './shared/artists/artists.component';
import { AlbumsComponent } from './shared/albums/albums.component';
import { PlaylistsComponent } from './shared/playlists/playlists.component';
import { GenresComponent } from './shared/genres/genres.component';
import { LikedTracksComponent } from './liked-tracks/liked-tracks.component';
import { SearchResultComponent } from './search-result/search-result.component';

@NgModule({
  declarations: [
    NotFoundComponent,
    LibraryComponent,
    HomeComponent,
    AsideComponent,
    PlayerComponent,
    SearchComponent,
    MusicPageComponent,
    GenreComponent,
    EqualizerComponent,
    TracksComponent,
    ArtistsComponent,
    AlbumsComponent,
    PlaylistsComponent,
    GenresComponent,
    LikedTracksComponent,
    SearchResultComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatProgressBarModule,
    MatSidenavModule,
    L10nTranslationModule,
    L10nIntlModule,
    CookieModule.withOptions(),
    MatButtonModule,
    MatListModule,
    MatSliderModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatChipsModule,
    MatGridListModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    MatMenuModule,
  ],
  exports: [
    MusicPageComponent,
    HomeComponent,
    MatInputModule,
  ],
})
export class MusicModule { }
