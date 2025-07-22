import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AppComponent } from './components/isci/isci.component';
import {ForgotPasswordComponent} from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/forgot-password/reset-password.component';

export const routes: Routes = [
  { path: '', redirectTo: '/giris', pathMatch: 'full' },
  { path: 'giris', component: LoginComponent },
  { path: 'kayit', component: RegisterComponent },
  { path: 'dashboard', component: AppComponent },
  { path: 'sifremi-unuttum', component: ForgotPasswordComponent },
  { path: 'sifre-sifirla', component: ResetPasswordComponent }, // <-- Önemli!
  { path: '**', redirectTo: '/giris' }
];
