import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NotFoundComponent } from '../core/not-found/not-found.component';
import { LibraryComponent } from './library/library.component';
import { HomeComponent } from './home/home.component';
import { AsideComponent } from './aside/aside.component';
import { PlayerComponent } from './player/player.component';
import { SearchComponent } from './search/search.component';
import { MusicPageComponent } from './music-page/music-page.component';
import { PlayListComponent } from './play-list/play-list.component';

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
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatSidenavModule,
  ],
  exports: [
    MusicPageComponent,
    HomeComponent,
  ],
})
export class MusicModule { }
