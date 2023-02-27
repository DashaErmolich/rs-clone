import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { userIconsData } from '../../../../assets/user-icons/user-icons';
import { IUserIcons } from '../../../models/user-icons.models';
import { ThemeHelper } from '../../../helpers/theme-helper';
import { StateService } from '../../../services/state.service';
import { ThemeService } from '../../../services/theme.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { USER_NAME_MIN_LENGTH, USER_NAME_MAX_LENGTH } from '../../../constants/constants';

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

  isUserNameChanged$ = new BehaviorSubject<boolean>(false);

  isUserIconChanged$ = new BehaviorSubject<boolean>(false);

  userNameFormControl!: FormControl;

  userNamePlaceholder = '';

  constructor(
    private myState: StateService,
    private snackBar: MatSnackBar,
    private authServe: AuthorizationService,
    private router: Router,
    myTheme: ThemeService,
    private muAuth: AuthorizationService,
    private myRouter: Router,
  ) {
    super(myTheme);
  }

  ngOnInit(): void {
    this.userName$ = this.myState.userName$.subscribe((data) => {
      this.userName = data;
      this.userNameFormControl = new FormControl(
        this.userName,
        [
          Validators.required,
          Validators.minLength(USER_NAME_MIN_LENGTH),
          Validators.maxLength(USER_NAME_MAX_LENGTH),
        ],
      );
    });
    this.userIcon$ = this.myState.userIconId$.subscribe((data) => {
      this.userIconId = data;
    });
    this.setPlaceholders();
  }

  ngOnDestroy(): void {
    this.userIcon$.unsubscribe();
    this.userName$.unsubscribe();
  }

  setUserIcon(iconIndex: number): void {
    this.isUserIconChanged$.next(true);
    this.userIconId = iconIndex;
  }

  setUserName(event: Event | null): void {
    this.isUserNameChanged$.next(true);
    if (event?.target instanceof HTMLInputElement) {
      this.userName = event.target.value;
    }
  }

  submitLogout() {
    this.isUserNameChanged$.next(false);
    this.isUserIconChanged$.next(false);
    this.muAuth.logout();

    localStorage.removeItem('trackList');
    localStorage.removeItem('volume');
    this.myState.resetPlayingTrackList();

    this.snackBar.open('You are logged out!', '🔑', {
      duration: 3000,
    });
    this.authServe.logout();
    setTimeout(() => {
      this.router.navigate(['welcome']);
    }, 1000);
  }

  updateUserData() {
    this.isUserNameChanged$.next(false);
    this.isUserIconChanged$.next(false);
    this.myState.setUserData(this.userName, this.userIconId);
  }

  onSubmit(form: FormControl) {
    if (form.valid) {
      this.updateUserData();
    }
    this.myState.setUserData(this.userName, this.userIconId);
  }

  setPlaceholders() {
    const { cookie } = document;

    if (cookie.includes('ru-RU')) {
      this.userNamePlaceholder = 'Имя пользователя';
    } else {
      this.userNamePlaceholder = 'Username';
    }
  }
}
