import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { serverUrl } from '../constants/constants';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.includes(serverUrl)) {
      const authReq = req.clone({
        withCredentials: true,
        headers: req.headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`),
      })
      console.log(`auth interceptor works! Modified request: `)
      console.log(authReq)
      return next.handle(authReq)
    }
    else return next.handle(req);
  }
}