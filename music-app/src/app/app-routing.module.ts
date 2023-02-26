import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { WelcomeComponent } from './core/welcome/welcome.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { MusicPageComponent } from './music/music-page/music-page.component';
import { HomeComponent } from './music/pages/home/home.component';
import { SearchComponent } from './music/pages/search/search.component';
import { LibraryComponent } from './music/pages/library/library.component';
import { SettingsPageComponent } from './user/settings/settings-page/settings-page.component';
import { SettingsLanguageComponent } from './user/settings/settings-language/settings-language.component';
import { SettingsThemeComponent } from './user/settings/settings-theme/settings-theme.component';
import { SettingsAccountComponent } from './user/settings/settings-account/settings-account.component';
import { GenreComponent } from './music/pages/genre/genre.component';
import { LikedTracksComponent } from './music/pages/liked-tracks/liked-tracks.component';
import { SearchResultComponent } from './music/pages/search-result/search-result.component';
import { AuthorizedGuard } from './guards/isAuthorized.guard';
import { CustomPlaylistComponent } from './music/pages/custom-playlist/custom-playlist.component';

const routes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: 'welcome', component: WelcomeComponent },
  {
    path: 'music',
    component: MusicPageComponent,
    canActivateChild: [AuthorizedGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'search', component: SearchComponent },
      { path: 'library', component: LibraryComponent },
      { path: 'liked-tracks', component: LikedTracksComponent },
      { path: 'play-list/:playlist', component: SearchResultComponent },
      { path: 'genre/:genre', component: GenreComponent },
      { path: 'artist/:artist', component: SearchResultComponent },
      { path: 'album/:album', component: SearchResultComponent },
      { path: 'radio/:radio', component: SearchResultComponent },
      { path: 'custom-playlist', component: CustomPlaylistComponent },
    ],
  },
  {
    path: 'settings',
    component: SettingsPageComponent,
    canActivateChild: [AuthorizedGuard],
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
