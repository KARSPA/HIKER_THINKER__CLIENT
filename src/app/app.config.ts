import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './_helpers/interceptors/authInterceptor';
import { AuthService } from './services/auth.service';
import { firstValueFrom } from 'rxjs';
import { errorInterceptor } from './_helpers/interceptors/errorInterceptor';



function initializeApp(authService : AuthService, router : Router) {
  return () => {
    const publicRoutes = ['/', '/home', '/register'];
    const currentPath = window.location.pathname;
    
    // Vérifier si un token est stocké
    const token = localStorage.getItem('HT_Token');

    if (!token && publicRoutes.includes(currentPath)) {
      // Si on est sur une route publique et qu'on a pas de token, on ne fait pas la vérification
      return Promise.resolve();
    }
    
    // Si on a un tokne sur une route privée on vérifie sa validité
    return firstValueFrom(authService.verifyConnected())
      .then(response => authService.handleLoginSuccess(response.data))
      .catch(() => authService.logout());
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AuthService, Router],
      multi: true
    },
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding())]
};
