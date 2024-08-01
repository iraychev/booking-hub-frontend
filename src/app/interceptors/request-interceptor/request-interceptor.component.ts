import { Injectable, Provider } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { EMPTY, Observable, catchError, finalize } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoadingService } from '../../services.loading-service.service';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingService: LoadingService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.loadingService.setLoading(true);

    let clonedRequest = request.clone();
    const jwt = this.authService.getToken();
    if (jwt) {
      clonedRequest = request.clone({
        setHeaders: { Authorization: 'Bearer ' + jwt },
      });
    }

    return next.handle(clonedRequest).pipe(
      catchError((errorRes: HttpErrorResponse) => {
        if (errorRes.status === 401) {
          this.authService.logout();
          return EMPTY;
        }
        throw errorRes;
      }),
      finalize(() => {
        this.loadingService.setLoading(false);
      })
    );
  }
}

export const interceptorProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: RequestInterceptor,
  multi: true,
};
