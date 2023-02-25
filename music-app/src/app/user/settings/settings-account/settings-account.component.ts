import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { FormControl, Validators, FormGroup } from '@angular/forms';
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

  userNameMinLength = USER_NAME_MIN_LENGTH;

  userNameMaxLength = USER_NAME_MAX_LENGTH;

  isSettingsChanged$ = new BehaviorSubject<boolean>(false);

  isUserIconChanged$ = new BehaviorSubject<boolean>(false);

  isChangesSaved = false;

  // userNameFormControl = new FormControl(
  //   '',
  //   [
  //     Validators.required,
  //     Validators.minLength(USER_NAME_MIN_LENGTH),
  //     Validators.maxLength(USER_NAME_MAX_LENGTH),
  //   ],
  // );

  const formGroup = new FormGroup({
    name: new FormControl(
      '',
      [
        Validators.required,
        Validators.minLength(USER_NAME_MIN_LENGTH),
        Validators.maxLength(USER_NAME_MAX_LENGTH),
      ],
    ),
  });

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
    // this.isUserIconChanged$.next(true);
    this.isSettingsChanged$.next(true);
    this.userIconId = iconIndex;
  }

  setUserName(event: Event | null): void {
    event?.preventDefault();
    this.isSettingsChanged$.next(true);
    if (event?.target instanceof HTMLInputElement) {
      this.userName = event.target.value;
    }
  }

  submitLogout() {
    this.isSettingsChanged$.next(false);
    this.muAuth.logout();
    this.myRouter.navigate(['welcome']);
  }

  updateUserData() {
    this.isSettingsChanged$.next(false);
    this.isUserIconChanged$.next(false);
    this.myState.setUserData(this.userName, this.userIconId);
  }

  onSubmit(form: FormControl) {
    const formValue = this.userNameFormControl;
    if (form.valid) {
      if (formValue) {
        this.updateUserData();
      }
    }
  }
}
