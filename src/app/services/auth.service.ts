import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuthResponse, AuthErrorResponse } from '../models/auth-response.model';
import {environment} from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`; // Sadece bu olmalı
  private loginStatusKey = 'isLoggedIn';

  constructor(private http: HttpClient) {}

  /** CSRF token oluşturmak için sade endpoint */
  getCsrfToken(): Observable<any> {
    return this.http.get('http://localhost:8080/api/csrf', {
      withCredentials: true,
      observe: 'response'
    }).pipe(
      tap(response => {
        console.log('CSRF token isteği başarılı:', response);
        const cookies = document.cookie;
        console.log('Mevcut cookies:', cookies);
      })
    );
  }

  login(email: string, sifre: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/giris`,
      { email, sifre },
      { withCredentials: true }
    ).pipe(
      tap(response => {
        if (response.message === "Giriş başarılı!") {
          localStorage.setItem(this.loginStatusKey, 'true');
        }
      }),
      catchError(error => {
        console.error('Login hatası:', error);
        throw error;
      })
    );
  }

  cikisYap(): void {
    this.http.post('http://localhost:8080/api/auth/cikis', {}, { withCredentials: true })
      .subscribe({
        next: () => {
          localStorage.removeItem(this.loginStatusKey);
        },
        error: () => {
          localStorage.removeItem(this.loginStatusKey);
        }
      });
  }

  register(email: string, sifre: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/kayit`,
      { email, sifre },
      { withCredentials: true }
    ).pipe(
      tap(response => {
        console.log('Kayıt işlemi başarılı:', response);
      }),
      catchError(error => {
        console.error('Register hatası:', error);
        throw error;
      })
    );
  }

  forgotPassword(email: string) {
    return this.http.post<{message: string}>(
      'http://localhost:8080/api/auth/sifremi-unuttum',
      { email },
      { withCredentials: true }
    );
  }

  resetPassword(anahtar: string, yeniSifre: string) {
    return this.http.post<{message: string}>(
      'http://localhost:8080/api/auth/sifre-sifirla',
      { anahtar, yeniSifre },
      { withCredentials: true }
    );
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.loginStatusKey) === 'true';
  }

  clearLoginStatus(): void {
    localStorage.removeItem(this.loginStatusKey);
  }
}
