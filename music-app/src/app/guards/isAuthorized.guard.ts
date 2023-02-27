import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot,
} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StateService } from '../services/state.service';
import { AuthorizationService } from '../services/authorization.service';

@Injectable()
export class AuthorizedGuard implements CanActivate, CanActivateChild {
  constructor(
    @Inject(StateService) private state: StateService,
    private router: Router,
    private authService: AuthorizationService,
    private snackBar: MatSnackBar,
  ) {}

  canActivate(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: ActivatedRouteSnapshot,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    state: RouterStateSnapshot,
  ): boolean {
    this.authService.checkAuth();

    if (!this.state.isAuthorized) {
      this.snackBar.open('Access denied! Please register or login', '❌', {
        duration: 3000,
      });
      this.router.navigate(['welcome']);
    }

    return this.state.isAuthorized;
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    return this.canActivate(next, state);
  }
}
