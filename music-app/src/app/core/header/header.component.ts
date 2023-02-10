import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  ActivatedRoute, NavigationStart, Router,
} from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  searchControl!: FormControl;

  isSearchRoute: boolean = false;

  searchValue!: string;

  queryParams$!: Subscription;

  searchControl$!: Subscription;

  events$!: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.searchControl = new FormControl();
    this.queryParams$ = this.route.queryParams.subscribe((param) => this.searchControl.setValue(param['q']));
    this.searchControl$ = this.searchControl.valueChanges.subscribe((res) => {
      this.searchValue = res;
      this.router.navigate(['music/search'], { queryParams: { q: this.searchValue } });
    });

    this.events$ = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const { url } = event;

        if (url.includes('/music/search')) {
          this.isSearchRoute = true;
        } else {
          this.isSearchRoute = false;
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.queryParams$) this.queryParams$.unsubscribe();
    if (this.searchControl$) this.searchControl$.unsubscribe();
    if (this.events$) this.events$.unsubscribe();
  }
}
