import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {

    const authService :  AuthService = inject(AuthService);
    const router : Router = inject(Router);


    //Vérifier si l'utilisateur est connecté.
    const isLogged = authService.isLogged();
    const requiresAuth = route.data['requiresAuth'] as boolean;

    // console.log(isLogged, requiresAuth)

    // Si on est connecté et qu'il faut l'être, c'est bon
    if(requiresAuth && isLogged) return true;
    
    // Si on n'est pas connecté et qu'il ne faut pas l'être, c'est bon aussi
    if(!requiresAuth && !isLogged) return true;

    // Si on a pas passé les conditions au dessus, on vérifie si il faut être connecté ou non
    if(requiresAuth){
        router.navigate(['login']);
    }else{
        router.navigate(['home']);
    }

    return false;
};
