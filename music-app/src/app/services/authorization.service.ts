import { Injectable } from '@angular/core';
import { IUserModel } from 'src/app/models/userModel.models';
import { StateService } from 'src/app/services/state.service';
import { AuthorizationApiService } from 'src/app/services/authorization-api.service';
import { take, catchError } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';
import { StatusCodes } from '../enums/statusCodes';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  constructor(
    private authService: AuthorizationApiService,
    private state: StateService,
    private localStore: LocalStorageService,
  ) {}

  login(email: string, password: string) {
    try {
      this.authService.login(email, password).pipe(
        take(1),
        catchError(() => []),
      ).subscribe((res) => {
        this.localStore.setToken(res.accessToken);
        this.state.setAuthorized(true);
        this.state.setUser(res.user);
      });
    // eslint-disable-next-line no-empty
    } catch (e) { }
  }

  registration(username: string, email: string, password: string) {
    this.authService.registration(username, email, password).pipe(take(1)).subscribe((res) => {
      this.localStore.setToken(res.accessToken);
      this.state.setAuthorized(true);
      this.state.setUser(res.user);
    });
  }

  logout() {
    try {
      this.authService.logout().pipe(take(1)).subscribe(() => {
        this.localStore.removeToken();
        this.state.setAuthorized(false);
        this.state.setUser({} as IUserModel);
      });
    // eslint-disable-next-line no-empty
    } catch (e) { }
  }

  checkAuth() {
    try {
      this.state.setAuthorized(!!this.localStore.getToken());

      this.authService.refresh().pipe(
        take(1),
        catchError(() => []),
      ).subscribe((res) => {
        if (res.accessToken) {
          this.localStore.setToken(res.accessToken);
          this.state.setAuthorized(true);
          this.state.setUser(res.user);
        }
      });
    // eslint-disable-next-line no-empty
    } catch (e) { }
  }

  fetch() {
    this.authService.fetchUsers().pipe(
      take(1),
      catchError((err) => {
        if (err.status === StatusCodes.RefreshRequired) {
          setTimeout(() => {
            this.fetch();
          }, 500);
        }
        return [];
      }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ).subscribe((res) => {
      // this logic will be used to save and load favorite songs.
    });
  }
}
