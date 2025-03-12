import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {

    const authService :  AuthService = inject(AuthService);
    const router : Router = inject(Router);


    //Vérifier si l'utilisateur est connecté.
    const isLogged : boolean = !(authService.currentUserSignal() === null || authService.currentUserSignal() === undefined)

    if(isLogged) return true;

    router.navigate(['login']);
    return false;
};
