import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { take } from 'rxjs/operators';
import { serverUrl } from '../constants/constants';
import { statusCodes } from '../enums/statusCodes';
import { refreshRequiredError } from '../errors/refreshRequired.error';
import { AuthorizationApiService } from '../services/authorization-api.service';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthorizationApiService, 
    private router: Router, 
    private localStore: LocalStorageService
    ) {}

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
        if (error.status === statusCodes.Unauthorized && this.localStore.getToken()) {
          try {
            this.localStore.removeToken();
            this.authService.refresh().pipe(take(1)).subscribe((res) => {
              if (res.accessToken) this.localStore.setToken(res.accessToken);
            })
          } catch (e) {}
          throw new refreshRequiredError('Users data refresh required');
        }
        else {
          this.router.navigate(['welcome']);
        }
       }
   }),
    )
  }
}