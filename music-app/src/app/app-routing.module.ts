import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { WelcomeComponent } from './core/welcome/welcome.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { MusicPageComponent } from './music/music-page/music-page.component';
import { HomeComponent } from './music/home/home.component';
// import { SearchComponent } from './music/search/search.component';
import { LibraryComponent } from './music/library/library.component';
import { PlayListComponent } from './music/play-list/play-list.component';
import { SettingsPageComponent } from './user/settings/settings-page/settings-page.component';
import { SettingsLanguageComponent } from './user/settings/settings-language/settings-language.component';
import { SettingsThemeComponent } from './user/settings/settings-theme/settings-theme.component';
import { SettingsAccountComponent } from './user/settings/settings-account/settings-account.component';
// import { GenreComponent } from './music/genre/genre.component';
// import { ArtistComponent } from './music/artist/artist.component';
const routes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: 'welcome', component: WelcomeComponent },
  {
    path: 'music',
    component: MusicPageComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      // { path: 'search', component: SearchComponent },
      { path: 'library', component: LibraryComponent },
      { path: 'play-list/:playListId', component: PlayListComponent },
      // { path: 'genre/:genreId', component: GenreComponent },
      // { path: 'artist/:artistId', component: ArtistComponent },
    ],
  },
  {
    path: 'settings',
    component: SettingsPageComponent,
    children: [
      { path: '', redirectTo: 'language', pathMatch: 'full' },
      { path: 'language', component: SettingsLanguageComponent },
      { path: 'theme', component: SettingsThemeComponent },
      { path: 'account', component: SettingsAccountComponent },
    ],
  },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
