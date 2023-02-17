import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  ActivatedRoute, NavigationStart, Router,
} from '@angular/router';
import { Subscription } from 'rxjs';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  searchControl: FormControl = new FormControl();

  isSearchRoute: boolean = false;

  searchValue: string = '';

  queryParams$: Subscription = new Subscription();

  searchControl$: Subscription = new Subscription();

  events$: Subscription = new Subscription();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private state: StateService,

  ) {}

  ngOnInit(): void {
    this.queryParams$ = this.route.queryParams.subscribe((param) => {
      if (param['q'] !== undefined) {
        this.searchControl.setValue(param['q']);
      } else {
        this.searchControl.setValue('');
      }
      if (this.queryParams$) this.queryParams$.unsubscribe();
    });

    this.searchControl$ = this.searchControl.valueChanges
      .subscribe((res) => {
        this.searchValue = res;
        this.state.setSearchParam(this.searchValue);
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
    if (this.searchControl$) this.searchControl$.unsubscribe();
    if (this.queryParams$) this.queryParams$.unsubscribe();
    if (this.events$) this.events$.unsubscribe();
  }
}
