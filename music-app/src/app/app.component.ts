import { Component, AfterContentChecked } from '@angular/core';
import { Observable } from 'rxjs';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent implements AfterContentChecked {
  title = 'music-app';

  isDarkTheme: Observable<boolean> | undefined;

  constructor(private themeService: ThemeService) { }

  ngAfterContentChecked(): void {
    this.themeService.checkTheme();
    this.isDarkTheme = this.themeService.isDarkTheme;
  }
}
