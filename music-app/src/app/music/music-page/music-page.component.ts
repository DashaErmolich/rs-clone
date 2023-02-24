import {
  Component, OnInit, OnDestroy,
} from '@angular/core';

import {
  animate, style, transition, trigger,
} from '@angular/animations';

import { ResponsiveAsideHelper } from '../../helpers/responsive-aside-helper';

@Component({
  selector: 'app-music-page',
  templateUrl: './music-page.component.html',
  styleUrls: ['./music-page.component.scss'],
  animations: [
    trigger('showNavigationMenu', [
      transition(':enter', [
        style({ transform: 'translateY(-100vh)' }),
        animate('300ms', style({ transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('300ms', style({ transform: 'translateY(-100vh)' })),
      ]),
    ]),
  ],
})

export class MusicPageComponent extends ResponsiveAsideHelper implements OnInit, OnDestroy {

}
