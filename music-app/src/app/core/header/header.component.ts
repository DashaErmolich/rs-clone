import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  ActivatedRoute, NavigationStart, Router,
} from '@angular/router';

import { Subscription } from 'rxjs';
import { StateService } from '../../services/state.service';
import { IUserIcons } from '../../models/user-icons.models';

import { userIconsData } from '../../../assets/user-icons/user-icons';
import { ThemeHelper } from '../../helpers/theme-helper';
import { ThemeService } from '../../services/theme.service';
import { ResponsiveService } from '../../services/responsive.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})

export class HeaderComponent extends ThemeHelper implements OnInit, OnDestroy {
  queryParams$: Subscription = new Subscription();

  searchControl$: Subscription = new Subscription();

  events$: Subscription = new Subscription();

  userName$: Subscription = new Subscription();

  userIconId$: Subscription = new Subscription();

  isHandset$: Subscription = new Subscription();

  isSearchInputShown$: Subscription = new Subscription();

  subscriptions: Subscription[] = [];

  searchControl: FormControl = new FormControl();

  isSearchRoute = false;

  searchValue = '';

  userIcons: IUserIcons[] = userIconsData;

  userIconsPath: string[] = this.userIcons.map((icon) => icon.path);

  userName!: string;

  userIconId!: number;

  isHandset = false;

  isSearchInputShown!: boolean;

  isUserDataShown = true;

  constructor(
    myTheme: ThemeService,
    private router: Router,
    private route: ActivatedRoute,
    private myState: StateService,
    private state: StateService,
    private responsive: ResponsiveService,
  ) {
    super(myTheme);
  }

  ngOnInit(): void {
    this.queryParams$ = this.route.queryParams.subscribe((param) => {
      if (param['q'] !== undefined) {
        this.searchControl.setValue(param['q']);
      } else {
        this.searchControl.setValue('');
      }
      if (this.queryParams$) this.queryParams$.unsubscribe();
    });
    this.subscriptions.push(this.queryParams$);

    this.searchControl$ = this.searchControl.valueChanges
      .subscribe((res) => {
        this.searchValue = res;
        this.state.setSearchParam(this.searchValue);
        this.router.navigate(['music/search'], { queryParams: { q: this.searchValue } });
      });
    this.subscriptions.push(this.searchControl$);

    this.events$ = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const { url } = event;

        if (url.includes('/music/search')) {
          this.isSearchRoute = true;
        } else {
          this.isSearchRoute = false;
        }

        if (url.includes('/welcome') || url.includes('/sign-in') || url.includes('/sign-up')) {
          this.isUserDataShown = false;
        } else {
          this.isUserDataShown = true;
        }
      }
    });
    this.subscriptions.push(this.events$);

    this.userName$ = this.myState.userName$.subscribe((data) => {
      this.userName = data;
    });
    this.subscriptions.push(this.userName$);

    this.userIconId$ = this.myState.userIconId$.subscribe((data) => {
      this.userIconId = data;
    });
    this.subscriptions.push(this.userIconId$);

    this.isHandset$ = this.responsive.isHandset$.subscribe((data) => {
      this.isHandset = data;
    });
    this.subscriptions.push(this.isHandset$);

    this.isSearchInputShown$ = this.myState.isSearchInputShown$.subscribe((data) => {
      this.isSearchInputShown = data;
    });
    this.subscriptions.push(this.isSearchInputShown$);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  toggleSearchInputVisibility() {
    this.myState.setSearchInputVisibility(!this.isSearchInputShown);
  }
}
