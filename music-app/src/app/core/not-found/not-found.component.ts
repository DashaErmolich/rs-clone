import { Component } from '@angular/core';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent {
  constructor(
    private myTheme: ThemeService,
  ) { }

  theme: string = this.myTheme.activeTheme;
}
