import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { userIconsData } from '../../../../assets/user-icons/user-icons';
import { IUserIcons } from '../../../models/user-icons.models';
import { ThemeHelper } from '../../../helpers/theme-helper';
import { StateService } from '../../../services/state.service';
import { ThemeService } from '../../../services/theme.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings-account',
  templateUrl: './settings-account.component.html',
  styleUrls: ['./settings-account.component.scss'],
})

export class SettingsAccountComponent extends ThemeHelper implements OnInit, OnDestroy {
  userIcons: IUserIcons[] = userIconsData;

  userIconsPath: string[] = this.userIcons.map((icon) => icon.path);

  userIconsId: number[] = this.userIcons.map((icon) => icon.id);

  userName!: string;

  userIconId!: number;

  userIcon$ = new Subscription();

  userName$ = new Subscription();

  constructor(
    private myState: StateService,
    myTheme: ThemeService,
    private muAuth: AuthorizationService,
    private myRouter: Router,
  ) {
    super(myTheme);
  }

  ngOnInit(): void {
    this.userName$ = this.myState.userName$.subscribe((data) => {
      this.userName = data;
    });
    this.userIcon$ = this.myState.userIconId$.subscribe((data) => {
      this.userIconId = data;
    });
  }

  ngOnDestroy(): void {
    this.userIcon$.unsubscribe();
    this.userName$.unsubscribe();
  }

  setUserIcon(iconIndex: number): void {
    this.userIconId = iconIndex;
    this.myState.setUserData(this.userName, this.userIconId);
  }

  setUserName(eventTarget: EventTarget | null): void {
    if (eventTarget instanceof HTMLInputElement) {
      this.userName = eventTarget.value;
    }
    this.myState.setUserData(this.userName, this.userIconId);
  }

  submitLogout() {
    // this.myState.updateUserData();
    this.muAuth.logout();
    this.myRouter.navigate(['welcome']);
  }
}
