import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sifre-sifirla',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent {
  yeniSifre = '';
  tekrarSifre = '';
  hata = '';
  basarili = '';
  anahtar = '';

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) {
    this.route.queryParams.subscribe(params => {
      this.anahtar = params['anahtar'] || '';
    });
  }

  resetPassword() {
    if (this.yeniSifre !== this.tekrarSifre) {
      this.hata = 'Şifreler eşleşmiyor!';
      this.basarili = '';
      return;
    }
    this.auth.resetPassword(this.anahtar, this.yeniSifre).subscribe({
      next: () => {
        this.basarili = 'Şifreniz başarıyla güncellendi!';
        this.hata = '';
        setTimeout(() => this.router.navigateByUrl('/giris'), 2000);
      },
      error: (err) => {
        this.hata = err.error?.message || 'Anahtar geçersiz veya süresi dolmuş!';
        this.basarili = '';
      }
    });
  }
}
