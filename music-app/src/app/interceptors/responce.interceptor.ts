import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { take } from 'rxjs/operators';
import { serverUrl } from '../constants/constants';
import { StateService } from '../core/services/state.service';
import { refreshRequiredError } from '../errors/refreshRequired.error';
import { AuthorizationApiService } from '../services/authorization-api.service';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  constructor(private authService: AuthorizationApiService, private router: Router, private storage: StateService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    if (!req.url.includes(serverUrl)) {
      return next.handle(req)
    }

    return next.handle(req).pipe(
      tap({
       next: (event) => {
           if (event instanceof HttpResponse) {
               console.log('Response interceptor has taken response: OK and send it out');
           }
           else {
            console.log('Response interceptor has taken request: OK and send it out');
           }
       },
       error: (error: HttpErrorResponse) => {
        console.log('Response interceptor: response ERROR');
        if (error.status === 401 && localStorage.getItem('token')) {
          try {
            console.log('Take 401. Trying to use refresh token to restore access') // ПОЧИСТИТЬ ЛОГИ
            localStorage.removeItem('token');
            this.authService.refresh().pipe(take(1)).subscribe((res) => {
              if (res.accessToken) localStorage.setItem('token', res.accessToken)
            })
          } catch (e) {
            console.error('Failed first attempt to refresh user token');
          }
          throw new refreshRequiredError('Требуется обновление данных о пользователе');
        }
        else {
          console.log('Failed final attempt to refresh user token. Redirect to welcome')
          this.router.navigate(['welcome']);
        }
       }
   }),
    )
  }
}