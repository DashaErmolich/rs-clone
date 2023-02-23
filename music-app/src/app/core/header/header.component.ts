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
import { ProgressLoaderService } from '../../services/progress-loader.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})

export class HeaderComponent extends ThemeHelper implements OnInit, OnDestroy {
  searchControl: FormControl = new FormControl();

  isSearchRoute: boolean = false;

  searchValue: string = '';

  queryParamsSubscription: Subscription = new Subscription();

  searchControlSubscription: Subscription = new Subscription();

  eventsSubscription: Subscription = new Subscription();

  userIcons: IUserIcons[] = userIconsData;

  userIconsPath: string[] = this.userIcons.map((icon) => icon.path);

  userName!: string;

  userIconId!: number;

  isLoading!: boolean;

  isLoadingSubscription = new Subscription();

  userNameSubscription = new Subscription();

  userIconIdSubscription = new Subscription();

  subscriptions: Subscription[] = [];

  constructor(
    myTheme: ThemeService,
    private router: Router,
    private route: ActivatedRoute,
    private myState: StateService,
    private state: StateService,
    public progressLoader: ProgressLoaderService,
  ) {
    super(myTheme);
  }

  ngOnInit(): void {
    this.queryParamsSubscription = this.route.queryParams.subscribe((param) => {
      if (param['q'] !== undefined) {
        this.searchControl.setValue(param['q']);
      } else {
        this.searchControl.setValue('');
      }
      if (this.queryParamsSubscription) this.queryParamsSubscription.unsubscribe();
    });

    this.subscriptions.push(this.queryParamsSubscription);

    this.searchControlSubscription = this.searchControl.valueChanges
      .subscribe((res) => {
        this.searchValue = res;
        this.state.setSearchParam(this.searchValue);
        this.router.navigate(['music/search'], { queryParams: { q: this.searchValue } });
      });

    this.subscriptions.push(this.searchControlSubscription);

    this.eventsSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const { url } = event;

        if (url.includes('/music/search')) {
          this.isSearchRoute = true;
        } else {
          this.isSearchRoute = false;
        }
      }
    });
    this.subscriptions.push(this.eventsSubscription);

    this.userNameSubscription = this.myState.userName$.subscribe((data) => {
      this.userName = data;
    });

    this.subscriptions.push(this.userNameSubscription);

    this.userIconIdSubscription = this.myState.userIconId$.subscribe((data) => {
      this.userIconId = data;
    });

    this.subscriptions.push(this.userIconIdSubscription);

    this.isLoadingSubscription = this.progressLoader.isLoading.subscribe((data) => {
      this.isLoading = data;
    });

    this.subscriptions.push(this.isLoadingSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
