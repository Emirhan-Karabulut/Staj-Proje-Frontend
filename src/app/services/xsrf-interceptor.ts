import { HttpInterceptorFn } from '@angular/common/http';

export const XsrfInterceptor: HttpInterceptorFn = (req, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    const token = getCookie('XSRF-TOKEN');
    if (token) {
      req = req.clone({
        setHeaders: { 'X-XSRF-TOKEN': token }
      });
      console.log('CSRF Token header eklendi:', req.headers.get('X-XSRF-TOKEN'));
    }
  }
  return next(req);
};

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
