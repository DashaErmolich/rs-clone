import { Injectable } from '@angular/core';
import { userModel } from 'src/app/models/userDto.models';
import { StateService } from 'src/app/services/state.service';
import { AuthorizationApiService } from 'src/app/services/authorization-api.service';
import { take, catchError } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  constructor(
    private authService: AuthorizationApiService,
    private state: StateService,
    private localStore: LocalStorageService
    ) {}

    login(username: string, email: string, password: string) {
      try {
        this.authService.login(username, email, password).pipe(take(1)).subscribe((res) => {
          this.localStore.setToken(res.accessToken)
          this.state.setAuthorized(true);
          this.state.setUser(res.user)
        })
      } catch (e) {}
    }
  
    registration(username: string, email: string, password: string) {
      try {
        this.authService.registration(username, email, password).pipe(take(1)).subscribe((res) => {
          this.localStore.setToken(res.accessToken)
          this.state.setAuthorized(true);
          this.state.setUser(res.user)
        })
      } catch (e) {}
    }
  
    logout() {
      try {
        this.authService.logout().pipe(take(1)).subscribe(() => {
          this.localStore.removeToken();
          this.state.setAuthorized(false);
          this.state.setUser({} as userModel)
        })
      } catch (e) {}
    }
    
    checkAuth() {
      try {
        this.state.setAuthorized(this.localStore.getToken() ? true : false)

        this.authService.refresh().pipe(
        take(1),
        catchError(err => {
          return []
        }),
        ).subscribe((res) => {
          if (res.accessToken) {
            this.localStore.setToken(res.accessToken)
            this.state.setAuthorized(true);
            this.state.setUser(res.user)
          }
        })
      } catch (e) {}
    }
  
    fetch() {
        this.authService.fetchUsers().pipe(
        take(1),  
        catchError(err => {
          if (err.status === 403) {
            setTimeout(() => {
              this.fetch();
            }, 500)
          }
          return [];
      })).subscribe((res) => {
          // this logic will be used to save and load favorite songs.
        })
    }

}
