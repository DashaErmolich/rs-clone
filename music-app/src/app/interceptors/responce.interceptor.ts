import {
  HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { take } from 'rxjs/operators';
import { serverUrl } from '../constants/constants';
import { StatusCodes } from '../enums/statusCodes';
import { RefreshRequiredError } from '../errors/refreshRequired.error';
import { AuthorizationApiService } from '../services/authorization-api.service';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthorizationApiService,
    private router: Router,
    private localStore: LocalStorageService,
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (!req.url.includes(serverUrl)) {
      return next.handle(req);
    }

    return next.handle(req).pipe(
      tap({
        error: (error: HttpErrorResponse) => {
          if (error.status === StatusCodes.Unauthorized) {
            if (this.localStore.getToken()) {
              this.localStore.removeToken();
              this.authService.refresh().pipe(take(1)).subscribe((res) => {
                if (res.accessToken) this.localStore.setToken(res.accessToken);
              });
              throw new RefreshRequiredError('Users data refresh required');
            } else this.router.navigate(['welcome']);
          }
        },
      }),
    );
  }
}