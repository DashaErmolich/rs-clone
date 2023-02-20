import { Directive, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ResponsiveService } from '../services/responsive.service';
import { StateService } from '../services/state.service';

@Directive()

export class ResponsiveAsideHelper implements OnInit, OnDestroy {
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
