import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { switchMap, of } from 'rxjs';

export const XsrfInterceptor: HttpInterceptorFn = (req, next) => {
  // Sadece POST, PUT, DELETE istekleri için CSRF token ekle
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
    const token = getCookie('XSRF-TOKEN');
    if (token) {
      req = req.clone({
        setHeaders: { 'X-XSRF-TOKEN': token }
      });
      console.log('CSRF Token header eklendi:', req.headers.get('X-XSRF-TOKEN'));
    } else {
      console.warn('CSRF Token bulunamadı, yeni token alınacak');
      const authService = inject(AuthService);
      // Token yoksa önce token al, sonra isteği tekrar dene
      return authService.getCsrfToken().pipe(
        switchMap(() => {
          const newToken = getCookie('XSRF-TOKEN');
          if (newToken) {
            console.log('CSRF token başarıyla alındı');
            req = req.clone({
              setHeaders: { 'X-XSRF-TOKEN': newToken }
            });
          } else {
            console.warn('CSRF Token alınamadı!');
          }
          return next(req);
        })
      );
    }
  }

  return next(req);
};

// Yardımcı fonksiyon - cookie okuma
function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}
