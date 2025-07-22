import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export const XsrfInterceptor: HttpInterceptorFn = (req, next) => {
  const document = inject(DOCUMENT);

  // Sadece POST, PUT, DELETE istekleri için CSRF token ekle
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
    // Önce mevcut token'ı kontrol et
    let token = getCookie('XSRF-TOKEN', document);

    if (!token) {
      console.warn('CSRF Token bulunamadı, yeni token alınacak');
      // Token yoksa önce CSRF endpoint'ini çağır
      return getCsrfTokenSync(req.url).pipe(
        switchMap(() => {
          token = getCookie('XSRF-TOKEN', document);
          if (token) {
            const newReq = addCsrfHeader(req, token);
            console.log('Yeni CSRF Token ile istek gönderiliyor:', token);
            return next(newReq);
          } else {
            console.error('CSRF Token alınamadı!');
            return next(req);
          }
        })
      );
    } else {
      // Token varsa direkt ekle
      const newReq = addCsrfHeader(req, token);
      console.log('Mevcut CSRF Token ile istek gönderiliyor:', token);
      return next(newReq);
    }
  }

  return next(req);
};

// CSRF token header'ını ekle
function addCsrfHeader(req: HttpRequest<any>, token: string): HttpRequest<any> {
  return req.clone({
    setHeaders: {
      'X-XSRF-TOKEN': token
    }
  });
}

// Geliştirilmiş cookie okuma fonksiyonu
function getCookie(name: string, document: Document): string | null {
  if (!document.cookie) {
    return null;
  }

  const cookies = document.cookie.split(';').map(cookie => cookie.trim());
  const targetCookie = cookies.find(cookie => cookie.startsWith(`${name}=`));

  if (targetCookie) {
    const value = targetCookie.substring(name.length + 1);
    console.log(`Cookie "${name}" bulundu:`, value);
    return decodeURIComponent(value);
  }

  console.log(`Cookie "${name}" bulunamadı. Mevcut cookies:`, document.cookie);
  return null;
}

// CSRF token almak için senkron istek
function getCsrfTokenSync(originalUrl: string): Observable<any> {
  // Backend URL'sini original request'ten çıkar
  const baseUrl = extractBaseUrl(originalUrl);
  const csrfUrl = `${baseUrl}/api/csrf`;

  return from(
    fetch(csrfUrl, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (!response.ok) {
        throw new Error(`CSRF token alınamadı: ${response.status}`);
      }
      console.log('CSRF token başarıyla alındı');
      return response;
    }).catch(error => {
      console.error('CSRF token alma hatası:', error);
      throw error;
    })
  );
}

// Base URL'yi çıkar
function extractBaseUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.host}`;
  } catch {
    // Eğer tam URL değilse, varsayılan backend URL'sini kullan
    return 'https://staj-proje-production.up.railway.app';
  }
}
