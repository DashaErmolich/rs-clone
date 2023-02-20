import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ResponsiveService } from '../../services/responsive.service';

@Component({
  selector: 'app-music-page',
  templateUrl: './music-page.component.html',
  styleUrls: ['./music-page.component.scss'],
})
export class MusicPageComponent implements OnInit, OnDestroy {
  showFiller = false;

  isSmall = false;

  isHandset = false;

  isExtraSmall = false;

  isSmall$ = new Subscription();

  isHandset$ = new Subscription();

  isExtraSmall$ = new Subscription();

  constructor(
    private responsive: ResponsiveService,
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
  }

  ngOnDestroy(): void {
    this.isSmall$.unsubscribe();
    this.isHandset$.unsubscribe();
    this.isExtraSmall$.unsubscribe();
  }
}
