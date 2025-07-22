import { Bolum } from './bolum.model';

export class Isci {
  id?: number;
  isim: string = '';
  soyisim: string = '';
  bolum!: Bolum;
  tcKimlikNo: string = '';
  dogumTarihi: string = '';

  constructor(data?: Partial<Isci>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  /**
   * Form validasyonu için yardımcı metot
   */
  isValid(): { valid: boolean, message?: string } {
    if (!this.isim?.trim()) {
      return { valid: false, message: 'İsim zorunludur' };
    }

    if (!this.soyisim?.trim()) {
      return { valid: false, message: 'Soyisim zorunludur' };
    }

    if (!this.bolum) {
      return { valid: false, message: 'Bölüm seçilmelidir' };
    }

    if (!this.dogumTarihi) {
      return { valid: false, message: 'Doğum tarihi zorunludur' };
    }

    const adSoyadRegex = /^[a-zA-ZçÇğĞıİöÖşŞüÜ\s-]+$/;
    if (!adSoyadRegex.test(this.isim)) {
      return { valid: false, message: "İsim sadece harf, boşluk ve tire (-) içerebilir." };
    }

    if (!adSoyadRegex.test(this.soyisim)) {
      return { valid: false, message: "Soyisim sadece harf, boşluk ve tire (-) içerebilir." };
    }

    // TC Kimlik No validasyonu (sadece dolu ise kontrol et)
    if (this.tcKimlikNo && !/^[1-9][0-9]{10}$/.test(this.tcKimlikNo)) {
      return { valid: false, message: "TC kimlik numarası 11 haneli olmalı ve 0 ile başlamamalıdır." };
    }

    return { valid: true };
  }
}
