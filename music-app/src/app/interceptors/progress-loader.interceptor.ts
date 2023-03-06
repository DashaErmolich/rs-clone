import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { ProgressLoaderService } from '../services/progress-loader.service';

@Injectable()
export class ProgressLoaderInterceptor implements HttpInterceptor {
  constructor(public progressLoaderService: ProgressLoaderService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    this.progressLoaderService.show();
    return next.handle(request).pipe(finalize(() => this.progressLoaderService.hide()));
  }
}
