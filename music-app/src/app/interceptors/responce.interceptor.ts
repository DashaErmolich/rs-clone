import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { take } from 'rxjs/operators';
import { serverUrl } from '../constants/constants';
import { StateService } from '../services/state.service';
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
       error: (error: HttpErrorResponse) => {
        if (error.status === 401 && localStorage.getItem('token')) {
          try {
            localStorage.removeItem('token');
            this.authService.refresh().pipe(take(1)).subscribe((res) => {
              if (res.accessToken) localStorage.setItem('token', res.accessToken)
            })
          } catch (e) {}
          throw new refreshRequiredError('Требуется обновление данных о пользователе');
        }
        else {
          this.router.navigate(['welcome']);
        }
       }
   }),
    )
  }
}