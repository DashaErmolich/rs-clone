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
  searchControl: FormControl = new FormControl();

  isSearchRoute: boolean = false;

  searchValue: string = '';

  queryParams$: Subscription = new Subscription();

  searchControl$: Subscription = new Subscription();

  events$: Subscription = new Subscription();

  userIcons: IUserIcons[] = userIconsData;

  userIconsPath: string[] = this.userIcons.map((icon) => icon.path);

  userName!: string;

  userIconId!: number;

  isHandset = false;

  isHandset$ = new Subscription();

  isSmall = false;

  isSmall$ = new Subscription();

  isSearchInputShown$ = new Subscription();

  isSearchInputShown!: boolean;

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
    this.myState.userName$.subscribe((data) => {
      this.userName = data;
    });
    this.myState.userIconId$.subscribe((data) => {
      this.userIconId = data;
    });
    this.isHandset$ = this.responsive.isHandset$.subscribe((data) => {
      this.isHandset = data;
    });
    this.isSmall$ = this.responsive.isSmall$.subscribe((data) => {
      this.isSmall = data;
    });
    this.isSearchInputShown$ = this.myState.isSearchInputShown$.subscribe((data) => {
      this.isSearchInputShown = data;
    });
  }

  ngOnDestroy(): void {
    if (this.searchControl$) this.searchControl$.unsubscribe();
    if (this.queryParams$) this.queryParams$.unsubscribe();
    if (this.events$) this.events$.unsubscribe();
    this.isSmall$.unsubscribe();
    this.isHandset$.unsubscribe();
    this.isSearchInputShown$.unsubscribe();
  }

  toggleSearchInputVisibility() {
    this.myState.setSearchInputVisibility(!this.isSearchInputShown);
  }
}
