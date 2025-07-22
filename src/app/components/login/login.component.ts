import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthResponse, AuthErrorResponse } from '../../models/auth-response.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  sifre = '';
  hata = '';

  constructor(private auth: AuthService, private router: Router) {}

  girisYap() {
    if (!this.email.trim() || !this.sifre.trim()) {
      this.hata = 'E-posta adresi ve şifre zorunludur!';
      return;
    }

    this.auth.login(this.email, this.sifre).subscribe({
      next: (response: AuthResponse) => {
        this.hata = '';
        this.router.navigateByUrl('/dashboard');
      },
      error: (err: HttpErrorResponse) => {
        const apiError = err.error as AuthErrorResponse;
        this.hata = apiError.message || 'E-posta veya şifre hatalı!';
      }
    });
  }
}
