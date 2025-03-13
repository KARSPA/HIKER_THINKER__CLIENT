import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './_helpers/interceptors/authInterceptor';
import { AuthService } from './services/auth.service';
import { firstValueFrom } from 'rxjs';



function initializeApp(authService : AuthService) {
  return () => firstValueFrom(authService.verifyConnected())
  .then(response => authService.handleLoginSuccess(response.data))
  .catch(()=> authService.logout());
}



export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AuthService],
      multi: true
    },
    provideHttpClient(withInterceptors([authInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)]
};
