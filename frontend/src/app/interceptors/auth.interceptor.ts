import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    // Lista de rutas públicas donde no necesitamos token
    const publicEndpoints = ['/login', '/registro'];
    if (publicEndpoints.some(url => req.url.includes(url))) {
        return next(req);
    }

    const authService = inject(AuthService);
    const token = authService.getToken();

    if (token) {
        // Si tenemos token, clonamos la petición y le añadimos la cabecera
        console.log('AuthInterceptor: Añadiendo token a', req.url);
        const authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        return next(authReq).pipe(
            catchError((err) => {
                if (err.status === 401) {
                    console.error('AuthInterceptor: Error 401 detectado en request', req.url);
                    // Opcional: Podríamos redirigir aquí, pero quiero ver el log primero
                }
                throw err;
            })
        );
    } else {
        return next(req);
    }
};
