import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {
  email = '';
  successMsg = '';
  errorMsg = '';

  constructor(private auth: AuthService) {}

  sifremiUnuttum() {
    this.auth.forgotPassword(this.email).subscribe({
      next: (res) => {
        this.successMsg = res.message || 'Şifre sıfırlama e-postası gönderildi!';
        this.errorMsg = '';
      },
      error: (err: HttpErrorResponse) => {
        this.errorMsg = err.error?.message || 'Bir hata oluştu!';
        this.successMsg = '';
      }
    });
  }
}
