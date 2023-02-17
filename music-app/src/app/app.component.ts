import { Component, OnInit } from '@angular/core';
import { StateService } from './services/state.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit{
  title = 'music-app';
  isAuthorized!: boolean;

  constructor(
    private themeService: ThemeService,
    private store: StateService
  ) {
    this.themeService.setActiveCssClass(this.themeService.activeThemeCssClass);
  }
  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.store.setAuthorized(true);
    }
  }
 
  getClass() {
    return this.themeService.activeCssClass$;
  }

  getStartClass() {
    return this.themeService.activeThemeCssClass;
  }
}
