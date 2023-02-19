import { Component, OnInit } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-music-page',
  templateUrl: './music-page.component.html',
  styleUrls: ['./music-page.component.scss'],
})
export class MusicPageComponent implements OnInit {
  showFiller = false;

  isSmall = false;

  isHandset = false;

  constructor(
    private responsive: BreakpointObserver,
  ) { }

  ngOnInit(): void {
    this.responsive.observe([
      Breakpoints.Small,
      Breakpoints.HandsetPortrait,
    ])
      .subscribe((result) => {
        if (result.breakpoints[Breakpoints.Small]
        || result.breakpoints[Breakpoints.HandsetPortrait]) {
          this.isSmall = true;
        } else {
          this.isSmall = false;
        }

        if (result.breakpoints[Breakpoints.HandsetPortrait]) {
          this.isHandset = true;
        } else {
          this.isHandset = false;
        }
      });
  }
}
