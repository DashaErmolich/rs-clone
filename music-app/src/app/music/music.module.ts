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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';

import { MatFormFieldModule } from '@angular/material/form-field';
import { CookieModule } from 'ngx-cookie';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotFoundComponent } from '../core/not-found/not-found.component';
import { LibraryComponent } from './pages/library/library.component';
import { HomeComponent } from './pages/home/home.component';
import { AsideComponent } from './aside/aside.component';
import { PlayerComponent } from './components/player/player.component';
import { SearchComponent } from './pages/search/search.component';
import { MusicPageComponent } from './music-page/music-page.component';
import { GenreComponent } from './pages/genre/genre.component';
import { EqualizerComponent } from './components/equalizer/equalizer.component';
import { TracksComponent } from './components/tracks/tracks.component';
import { ArtistsComponent } from './components/artists/artists.component';
import { AlbumsComponent } from './components/albums/albums.component';
import { PlaylistsComponent } from './components/playlists/playlists.component';
import { GenresComponent } from './components/genres/genres.component';
import { LikedTracksComponent } from './pages/liked-tracks/liked-tracks.component';
import { SearchResultComponent } from './pages/search-result/search-result.component';
import { RadiosComponent } from './components/radios/radios.component';
import { CurrentTrackListComponent } from './components/current-track-list/current-track-list.component';
import { CustomPlaylistComponent } from './pages/custom-playlist/custom-playlist.component';
import { CustomPlaylistTracksComponent } from './components/custom-playlist-tracks/custom-playlist-tracks.component';
import { CustomPlaylistsComponent } from './components/custom-playlists/custom-playlists.component';
import { CreatedPlaylistsComponent } from './pages/created-playlists/created-playlists.component';

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
    RadiosComponent,
    CurrentTrackListComponent,
    CustomPlaylistComponent,
    CustomPlaylistTracksComponent,
    CustomPlaylistsComponent,
    CreatedPlaylistsComponent,
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
    ReactiveFormsModule,
  ],
  exports: [
    MusicPageComponent,
    HomeComponent,
    MatInputModule,
  ],
})
export class MusicModule { }
