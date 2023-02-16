import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authReq = req.clone({
      withCredentials: true,
      headers: req.headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`),
    })
    console.log(`auth interceptor works! Request: `)
    console.log(authReq)
    // return next.handle(authReq);
    return next.handle(authReq).pipe(
      tap({
       next: (event) => {
           if (event instanceof HttpResponse) {
               console.log('Auth interceptor: OK');
               
           }
       },
       error: (error: HttpErrorResponse) => {
        console.log('Auth interceptor: ERROR');
          console.log('Error at auth interceptor:')
           throw error;
       }
   })
    )
  }
}