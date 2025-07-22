import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app/app.routes';
import { XsrfInterceptor } from './app/services/xsrf-interceptor';
import { AuthService } from './app/services/auth.service'; // <---- EKLE

import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>'
})
export class RootComponent implements OnInit {
  private auth = inject(AuthService);

  ngOnInit() {
    // Uygulama ilk açıldığında bir kez CSRF token GET isteği at
    this.auth.getCsrfToken().subscribe({
      next: () => console.log('CSRF token alındı!'),
      error: err => console.warn('CSRF token alınamadı!', err)
    });
  }
}

bootstrapApplication(RootComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([XsrfInterceptor])
    )
  ]
}).catch(err => console.error(err));
