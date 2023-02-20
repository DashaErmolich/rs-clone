import {
  Component, OnInit, OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import {
  animate, style, transition, trigger,
} from '@angular/animations';
import { ResponsiveService } from '../../services/responsive.service';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-music-page',
  templateUrl: './music-page.component.html',
  styleUrls: ['./music-page.component.scss'],
  animations: [
    trigger('showNavigationMenu', [
      transition(':enter', [
        style({ transform: 'translateY(-100vh)' }),
        animate('500ms', style({ transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('500ms', style({ transform: 'translateY(-100vh)' })),
      ]),
    ]),
  ],
})

export class MusicPageComponent implements OnInit, OnDestroy {
  showFiller = false;

  isSmall = false;

  isHandset = false;

  isExtraSmall = false;

  isSmall$ = new Subscription();

  isHandset$ = new Subscription();

  isExtraSmall$ = new Subscription();

  isNavigationMenuShown$ = new Subscription();

  isNavigationMenuShown!: boolean;

  constructor(
    private responsive: ResponsiveService,
    private myState: StateService,
  ) { }

  ngOnInit(): void {
    this.isSmall$ = this.responsive.isSmall$.subscribe((data) => {
      this.isSmall = data;
    });
    this.isHandset$ = this.responsive.isHandset$.subscribe((data) => {
      this.isHandset = data;
    });
    this.isExtraSmall$ = this.responsive.isExtraSmall$.subscribe((data) => {
      this.isExtraSmall = data;
    });
    this.isNavigationMenuShown$ = this.myState.isNavigationMenuShown$.subscribe((data) => {
      this.isNavigationMenuShown = data;
      console.log(this.isNavigationMenuShown);
    });
  }

  ngOnDestroy(): void {
    this.isSmall$.unsubscribe();
    this.isHandset$.unsubscribe();
    this.isExtraSmall$.unsubscribe();
    this.isNavigationMenuShown$.unsubscribe();
  }

  toggleNavigationMenuVisibility() {
    this.myState.setNavigationMenuVisibility(!this.isNavigationMenuShown);
  }
}
