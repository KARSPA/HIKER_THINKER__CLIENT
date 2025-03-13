import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { catchError, throwError } from "rxjs";



export const errorInterceptor : HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    return next(req).pipe(
        catchError(err => {
            // A VOIR POUR AFFINER PLUS TARD car si panel ADMIN la 401 ne voudra pas forcément dire que le token n'est plus valable
            if(err.status === 401){ // Si 401 c'est que notre token n'est plus valide 
                authService.logout();
                router.navigate(['/login']);
            }
            return throwError(() => err)
        })
    )
}