import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BehaviorSubject } from 'rxjs';

const extraSmallBreakpoint = '(max-width: 380px)';

@Injectable({
  providedIn: 'root',
})

export class ResponsiveService {
  isSmall$ = new BehaviorSubject<boolean>(false);

  isHandset$ = new BehaviorSubject<boolean>(false);

  isExtraSmall$ = new BehaviorSubject<boolean>(false);

  extraSmallBreakpoint = extraSmallBreakpoint;

  constructor(
    private responsive: BreakpointObserver,
  ) {
    this.responsive.observe([
      Breakpoints.Small,
      Breakpoints.HandsetPortrait,
      Breakpoints.HandsetLandscape,
      this.extraSmallBreakpoint,
    ])
      .subscribe((result) => {
        if (result.breakpoints[Breakpoints.Small]
        || result.breakpoints[Breakpoints.HandsetPortrait]
        ) {
          this.isSmall$.next(true);
        } else {
          this.isSmall$.next(false);
        }

        if (result.breakpoints[Breakpoints.HandsetPortrait]) {
          this.isHandset$.next(true);
        } else {
          this.isHandset$.next(false);
        }

        if (result.breakpoints[Breakpoints.HandsetLandscape]
          && !result.breakpoints[Breakpoints.Small]) {
          this.isSmall$.next(true);
          this.isHandset$.next(true);
        }

        if (this.responsive.isMatched(this.extraSmallBreakpoint)) {
          this.isExtraSmall$.next(true);
        } else {
          this.isExtraSmall$.next(false);
        }
      });
  }
}
