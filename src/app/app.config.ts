import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { interceptorProvider } from './interceptors/request-interceptor/request-interceptor.component';
import { ErrorService } from './services/error.service';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), importProvidersFrom(ErrorService), provideRouter(routes), provideHttpClient(withInterceptorsFromDi()), provideAnimationsAsync(), interceptorProvider]
};
