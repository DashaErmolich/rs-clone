import { Inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from "@angular/router";
import { StateService } from "../core/services/state.service";
import { AuthorizationService } from "../core/services/authorization.service";

@Injectable()
export class AuthorizedGuard implements CanActivate, CanActivateChild {
  constructor(
    @Inject(StateService) private state: StateService,
    private router: Router,
    private authService: AuthorizationService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    console.log('Guard check reached');
    this.authService.checkAuth();
    console.log('Guard check result:');
    console.log(this.state.isAuthorized);

      if (!this.state.isAuthorized) {
        this.router.navigate(['welcome']);
      }

    // })
    return this.state.isAuthorized;
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.canActivate(next, state)
  }
}