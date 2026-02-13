import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, catchError, of, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoginResponse, LoginUserDTO } from '../common/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // URL base de la API (puerto 9090)
  private readonly urlBase = 'http://localhost:9090/api/clinicas/';
  private readonly TOKEN_KEY = 'auth_token';

  // Estado reactivo del login
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  login(credentials: LoginUserDTO): Observable<boolean> {
    return this.http.post<LoginResponse>(this.urlBase + 'login', credentials).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          this.isLoggedInSubject.next(true);
        }
      }),
      map(() => true),
      catchError(error => {
        console.error('Error en login:', error);
        return of(false);
      })
    );
  }

  register(clinicaData: any): Observable<boolean> {
    return this.http.post<any>(this.urlBase + 'registro', clinicaData).pipe(
      map(() => true),
      catchError(error => {
        console.error('Error en registro:', error);
        return of(false);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getClinicaId(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.clinicaId || null;
    } catch (e) {
      console.error('Error decodificando token', e);
      return null;
    }
  }
}
