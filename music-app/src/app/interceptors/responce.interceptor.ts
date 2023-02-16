import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log(`Response interceptor works! Request: `)
    console.log(req)
    return next.handle(req).pipe(
      tap({
       next: (event) => {
           if (event instanceof HttpResponse) {
               console.log('Response interceptor: OK!');
               
           }
       },
       error: (error: HttpErrorResponse) => {
        console.log('Response interceptor: ERROR');
        if (error.status === 401 && localStorage.getItem('token')) {
          try {
            // const origReq = req;
            // const ifFirstRequest = true;
            this.authService.refresh().pipe(take(1)).subscribe((res) => {
              console.log('Trying to use refresh token to restore access') // ПОЧИСТИТЬ ЛОГИ
              localStorage.setItem('token', res.accessToken)
            })
          } catch (e) {
            console.error('Failed attempt to refresh user token');
          }
        }
        else {
          console.log('Failed attempt to refresh user token. Redirect to music')
          this.router.navigate(['music/home'])
        }
       }
   })
    )
  }
}