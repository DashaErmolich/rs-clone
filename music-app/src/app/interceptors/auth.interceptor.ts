import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { serverUrl } from '../constants/constants';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private localStore: LocalStorageService,
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.includes(serverUrl)) {
      const authReq = req.clone({
        withCredentials: true,
        headers: req.headers.set('Authorization', `Bearer ${this.localStore.getToken()}`),
      })
      return next.handle(authReq)
    }
    else return next.handle(req);
  }
}