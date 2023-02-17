import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { serverUrl } from 'src/app/constants/constants';
import { AuthResponse } from 'src/app/models/auth-response.models';
import { userModel } from 'src/app/models/userDto.models';
import { StateService } from './state.service';
import { AuthorizationApiService } from 'src/app/services/authorization-api.service';
import { take, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  constructor(
    private http: HttpClient,
    private authService: AuthorizationApiService,
    private state: StateService
    ) {}

    login(username: string, email: string, password: string) {
      try {
        this.authService.login(username, email, password).pipe(take(1)).subscribe((res) => {
          console.log('Login at state reached! Response:')
          console.log(res); // ПОЧИСТИТЬ ЛОГИ
          localStorage.setItem('token', res.accessToken)
          this.state.setAuthorized(true);
          this.state.setUser(res.user)
        })
      } catch (e) {
        console.error('Cached error at store/login:');
        console.error(e)
      }
    }
  
    registration(username: string, email: string, password: string) {
      try {
        this.authService.registration(username, email, password).pipe(take(1)).subscribe((res) => {
          console.log('Registration at state reached! Response:')
          console.log(res); // ПОЧИСТИТЬ ЛОГИ
          localStorage.setItem('token', res.accessToken)
          this.state.setAuthorized(true);
          this.state.setUser(res.user)
        })
      } catch (e) {
        console.error('Cached error at store/registration:');
        console.error(e)
      }
    }
  
    logout() {
      try {
        this.authService.logout().pipe(take(1)).subscribe(() => {
          localStorage.removeItem('token')
          this.state.setAuthorized(false);
          this.state.setUser({} as userModel)
          console.log('Logged out!')
        })
      } catch (e) {
        console.error('Cached error at store/logout:');
        console.error(e)
      }
    }
    
    checkAuth() {
      try {
        this.authService.refresh().pipe(take(1)).subscribe((res) => {
          console.log('Authorization is checking now! Response:')
          console.log(res); // ПОЧИСТИТЬ ЛОГИ
          if (res.accessToken) {
            localStorage.setItem('token', res.accessToken)
            console.log(this.state.isAuthorized)
            this.state.setAuthorized(true);
            this.state.setUser(res.user)
            console.log(this.state.isAuthorized)
          }
        })
      } catch (e) {
        console.error('Cached error at store/checkAuth:');
        console.error(e)
      }
    }
  
    fetch() {
        this.authService.fetchUsers().pipe(
        take(1),  
        catchError(err => {
          if (err.status === 403) {
            console.log('Refresh required error handled at fetch(). Token refreshed. Attempt to fetch() again');
            setTimeout(() => {
              this.fetch();
            }, 500)
          }
          return [];
      })).subscribe((res) => {
          console.log(res)
        })
    }

}
