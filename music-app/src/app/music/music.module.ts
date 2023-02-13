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

import { MatFormFieldModule } from '@angular/material/form-field';
import { NotFoundComponent } from '../core/not-found/not-found.component';
import { LibraryComponent } from './library/library.component';
import { HomeComponent } from './home/home.component';
import { AsideComponent } from './aside/aside.component';
import { PlayerComponent } from './player/player.component';
import { SearchComponent } from './search/search.component';
import { MusicPageComponent } from './music-page/music-page.component';
import { PlayListComponent } from './play-list/play-list.component';
import { GenreComponent } from './genre/genre.component';
import { ArtistComponent } from './artist/artist.component';
import { EqualizerComponent } from './equalizer/equalizer.component';

@NgModule({
  declarations: [
    NotFoundComponent,
    LibraryComponent,
    HomeComponent,
    AsideComponent,
    PlayerComponent,
    SearchComponent,
    MusicPageComponent,
    PlayListComponent,
    GenreComponent,
    ArtistComponent,
    EqualizerComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatProgressBarModule,
    MatSidenavModule,
    L10nTranslationModule,
    L10nIntlModule,
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
  ],
  exports: [
    MusicPageComponent,
    HomeComponent,
    MatInputModule,
    PlayerComponent,
  ],
})
export class MusicModule { }
