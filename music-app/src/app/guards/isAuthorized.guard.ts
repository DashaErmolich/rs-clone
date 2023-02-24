import { Inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from "@angular/router";
import { StateService } from "../services/state.service";
import { AuthorizationService } from "../services/authorization.service";

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
    this.authService.checkAuth();
    
    if (!this.state.isAuthorized) {
      this.router.navigate(['welcome']);
    }

    return this.state.isAuthorized;
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.canActivate(next, state)
  }
}