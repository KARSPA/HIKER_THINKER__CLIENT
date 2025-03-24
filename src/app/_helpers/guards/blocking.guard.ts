import { CanActivateFn, Router } from '@angular/router';

export const blockingGuard: CanActivateFn = (route, state) => {

    return false;
};
