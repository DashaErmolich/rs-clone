import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotFoundComponent } from '../core/not-found/not-found.component';
import { LibraryComponent } from './library/library.component';
import { HomeComponent } from './home/home.component';
import { AsideComponent } from './aside/aside.component';
import { PlayerComponent } from './player/player.component';
import { SearchComponent } from './search/search.component';
import { MusicPageComponent } from './music-page/music-page.component';

@NgModule({
  declarations: [
    NotFoundComponent,
    LibraryComponent,
    HomeComponent,
    AsideComponent,
    PlayerComponent,
    SearchComponent,
    MusicPageComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [
    MusicPageComponent,
    HomeComponent,
  ],
})
export class MusicModule { }
