import { Component, OnInit } from '@angular/core';

import { userIconsData } from '../../../../assets/user-icons/user-icons';
import { IUserIcons } from '../../../models/user-icons.models';
import { ThemeHelper } from '../../../helpers/theme-helper';
import { StateService } from '../../../services/state.service';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-settings-account',
  templateUrl: './settings-account.component.html',
  styleUrls: ['./settings-account.component.scss'],
})

export class SettingsAccountComponent extends ThemeHelper implements OnInit {
  userIcons: IUserIcons[] = userIconsData;

  userIconsPath: string[] = this.userIcons.map((icon) => icon.path);

  userIconsId: number[] = this.userIcons.map((icon) => icon.id);

  userName!: string;

  userIconId!: number;

  constructor(
    private myState: StateService,
    myTheme: ThemeService,
  ) {
    super(myTheme);
  }

  ngOnInit(): void {
    this.myState.userName$.subscribe((data) => {
      this.userName = data;
    });
    this.myState.userIconId$.subscribe((data) => {
      this.userIconId = data;
    });
  }
}
