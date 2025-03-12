import { HttpInterceptorFn } from "@angular/common/http";

export const authInterceptor : HttpInterceptorFn = (request, next) => {
    const token = localStorage.getItem('HT_Token') ?? '';

    request = request.clone({
        setHeaders: {
            Authorization: token ? `Bearer ${token}` : ''
        }
    })

    return next(request);
}