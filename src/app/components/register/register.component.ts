import { Component } from '@angular/core';
import { AuthService} from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthResponse, AuthErrorResponse } from '../../models/auth-response.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  email = '';
  sifre = '';
  tekrarSifre = '';
  hata = '';
  basarili = '';

  constructor(private auth: AuthService, private router: Router) {}

  kayitOl() {
    this.hata = '';
    this.basarili = '';

    if (!this.email.trim() || !this.sifre.trim() || !this.tekrarSifre.trim()) {
      this.hata = 'Tüm alanları doldurunuz!';
      return;
    }

    if (this.sifre !== this.tekrarSifre) {
      this.hata = 'Şifreler eşleşmiyor!';
      return;
    }

    // Email validasyonu için regex (isteğe göre özelleştir)
    if (!/^[a-zA-Z0-9_çğıöşüÇĞİÖŞÜ.]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.email)) {
      this.hata = 'Geçerli bir e-posta adresi giriniz!';
      return;
    }

    this.auth.register(this.email, this.sifre).subscribe({
      next: (response: AuthResponse) => {
        this.basarili = response.message || 'Kayıt başarılı! Giriş yapabilirsiniz.';
        setTimeout(() => {
          this.router.navigateByUrl('/giris');
        }, 2000);
      },
      error: (err: HttpErrorResponse) => {
        const apiError = err.error as AuthErrorResponse;
        if (apiError.message) {
          this.hata = apiError.message;
        } else if (apiError.errors && Array.isArray(apiError.errors)) {
          this.hata = apiError.errors.join(', ');
        } else {
          this.hata = 'Kayıt işlemi sırasında bir hata oluştu!';
        }
      }
    });
  }
}
