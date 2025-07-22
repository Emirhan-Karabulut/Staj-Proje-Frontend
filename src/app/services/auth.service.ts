import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';
  private loginStatusKey = 'isLoggedIn';

  constructor(private http: HttpClient) {}

  getCsrfToken(): Observable<any> {
    return this.http.get(environment.apiUrl + '/csrf', {
      withCredentials: true,
      observe: 'response'
    }).pipe(
      tap(response => console.log('CSRF token isteği başarılı:', response))
    );
  }

  login(email: string, sifre: string): Observable<any> {
    return this.http.post<any>(
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
    this.http.post(`${this.apiUrl}/cikis`, {}, { withCredentials: true })
      .subscribe({
        next: () => localStorage.removeItem(this.loginStatusKey),
        error: () => localStorage.removeItem(this.loginStatusKey)
      });
  }

  register(email: string, sifre: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/kayit`,
      { email, sifre },
      { withCredentials: true }
    ).pipe(
      tap(response => console.log('Kayıt işlemi başarılı:', response)),
      catchError(error => {
        console.error('Register hatası:', error);
        throw error;
      })
    );
  }

  forgotPassword(email: string) {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/sifremi-unuttum`,
      { email },
      { withCredentials: true }
    );
  }

  resetPassword(anahtar: string, yeniSifre: string) {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/sifre-sifirla`,
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
