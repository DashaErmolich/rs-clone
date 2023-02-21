import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  trigger, transition, style, animate,
} from '@angular/animations';
import { ResponsiveAsideHelper } from '../../../helpers/responsive-aside-helper';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss'],
  animations: [
    trigger('showSettingsMenu', [
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

export class SettingsPageComponent extends ResponsiveAsideHelper implements OnInit, OnDestroy {

}
