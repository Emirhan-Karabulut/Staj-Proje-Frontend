import { Component, OnInit } from '@angular/core';
import { IsciService } from '../../services/isci.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Isci } from '../../models/isci.model';
import { Bolum } from '../../models/bolum.model';
import { BolumIstatistik, IstatistikHelper } from '../../models/istatistik.model';
import { of } from 'rxjs';
import { retry, delay, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './isci.component.html'
})
export class AppComponent implements OnInit {
  yeniIsci: Isci = new Isci();
  duzenlemeModu = false;
  duzenlemId?: number;
  isciler: Isci[] = [];
  istatistikler: BolumIstatistik = {};
  bolumler: Bolum[] = [];
  isLoading: boolean = false; // Yükleme durumu
  errorMessage: string | null = null; // Hata mesajı
  successMessage: string | null = null; // Başarı mesajı
  messageTimeout: any = null; // Başarı mesajı için zamanlayıcı

  constructor(
    private isciService: IsciService,
    protected auth: AuthService,
    protected router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigateByUrl('/giris');
      return;
    }

    // İlk yükleme sırasında isLoading'i true yap
    this.isLoading = true;

    // Önce bölümleri yükle, sonra verileri yenile
    this.bolumlerYukle();

    // Bölümler yüklendikten sonra verileri yenile
    setTimeout(() => {
      this.verileriYenile();
    }, 100);
  }

  bolumlerYukle() {
    // isLoading'i burada ayarlamıyoruz, çünkü ngOnInit'te zaten ayarlandı
    this.isciService.getBolumler().subscribe({
      next: (data) => {
        this.bolumler = data.map(b => new Bolum(b));
        // isLoading'i burada false yapmıyoruz, verileriYenile() metodu bunu yapacak
      },
      error: (err) => {
        // Hata durumunda isLoading'i false yapmıyoruz, verileriYenile() metodu bunu yapacak
        this.errorMessage = 'Bölümler yüklenirken bir hata oluştu.';
      }
    });
  }

  verileriYenile() {
    this.isLoading = true;
    this.errorMessage = null;
    // Başarı mesajını koruyoruz, silmiyoruz

    // Ayarlanabilir: kaç kez denesin ve ne kadar geciksin
    const retryCount = 3;
    const delayMs = 250;

    // İki API çağrısının tamamlanmasını takip etmek için sayaç
    let completedCalls = 0;
    const totalCalls = 2;

    // Tüm çağrılar tamamlandığında isLoading'i false yap ve başarı mesajı varsa süresini yeniden başlat
    const checkAllCompleted = () => {
      completedCalls++;
      if (completedCalls >= totalCalls) {
        this.isLoading = false;

        // Eğer başarı mesajı varsa, süresini yeniden başlat
        if (this.successMessage) {
          // Önceki zamanlayıcıyı temizle ve yenisini başlat
          clearTimeout(this.messageTimeout);
          this.messageTimeout = setTimeout(() => this.successMessage = null, 5000);
        }
      }
    };

    this.isciService.listeleTum().pipe(
      delay(delayMs),
      retry(retryCount),
      catchError((err) => {
        this.errorMessage = 'İşçiler yüklenirken bir hata oluştu.';
        checkAllCompleted();
        return of([]); // boş dizi döndür
      })
    ).subscribe({
      next: (list) => {
        this.isciler = list.map(i => new Isci(i));
        checkAllCompleted();
      }
    });

    this.isciService.getBolumIstatistikleri().pipe(
      delay(delayMs),
      retry(retryCount),
      catchError((err) => {
        this.errorMessage = 'İstatistikler yüklenirken bir hata oluştu.';
        checkAllCompleted();
        return of({}); // boş nesne
      })
    ).subscribe({
      next: (stats) => {
        this.istatistikler = stats;
        checkAllCompleted();
      }
    });
  }

  cikisYap() {
    this.auth.cikisYap();
    this.router.navigateByUrl('/giris');
  }

  ekle() {
    const validationResult = this.yeniIsci.isValid();
    if (!this.duzenlemeModu && !this.yeniIsci.tcKimlikNo?.trim()) {
      this.errorMessage = "TC Kimlik No zorunludur!";
      return;
    }
    if (!validationResult.valid) {
      this.errorMessage = validationResult.message ?? null; // Handle undefined
      return;
    }
    this.yeniIsci.isim = this.yeniIsci.isim.trim();
    this.yeniIsci.soyisim = this.yeniIsci.soyisim.trim();
    if (this.yeniIsci.tcKimlikNo) {
      this.yeniIsci.tcKimlikNo = this.yeniIsci.tcKimlikNo.trim();
    }

    // Yükleme durumunu göster
    this.isLoading = true;

    if (this.duzenlemeModu && this.duzenlemId) {
      this.isciService.guncelleIsci(this.duzenlemId, this.yeniIsci).subscribe({
        next: () => {
          this.successMessage = 'İşçi başarıyla güncellendi!';
          this.errorMessage = null;
          clearTimeout(this.messageTimeout);
          this.messageTimeout = setTimeout(() => this.successMessage = null, 3000);
          this.formReset();

          // Verileri yenile (bu isLoading'i yönetecek)
          this.verileriYenile();
        },
        error: (err) => {
          // Hata durumunda yükleme durumunu kapat
          this.isLoading = false;
          this.errorMessage = err.status === 400 ? (err.error ?? 'Bilinmeyen hata') : 'Güncelleme sırasında bir hata oluştu!';
        }
      });
    } else {
      this.isciService.ekleIsci(this.yeniIsci).subscribe({
        next: () => {
          this.successMessage = 'İşçi başarıyla eklendi!';
          clearTimeout(this.messageTimeout);
          this.messageTimeout = setTimeout(() => this.successMessage = null, 3000);
          this.formReset();

          // Verileri yenile (bu isLoading'i yönetecek)
          this.verileriYenile();
        },
        error: (err) => {
          // Hata durumunda yükleme durumunu kapat
          this.isLoading = false;
          this.errorMessage = err.status === 400 ? (err.error ?? 'Bilinmeyen hata') : 'Ekleme sırasında bir hata oluştu!';
        }
      });
    }
  }

  duzenle(isci: Isci) {
    this.duzenlemeModu = true;
    this.duzenlemId = isci.id;
    this.yeniIsci = new Isci({
      id: isci.id,
      isim: isci.isim,
      soyisim: isci.soyisim,
      bolum: isci.bolum,
      tcKimlikNo: isci.tcKimlikNo,
      dogumTarihi: isci.dogumTarihi
    });
    this.errorMessage = null;
    window.scrollTo(0, 0);
  }

  iptal() {
    this.formReset();
  }

  private formReset() {
    this.duzenlemeModu = false;
    this.duzenlemId = undefined;
    this.yeniIsci = new Isci();
    this.errorMessage = null;
  }

  sil(id: number) {
    // Yükleme durumunu göster
    this.isLoading = true;

    this.isciService.silIsci(id).subscribe({
      next: () => {
        this.successMessage = 'İşçi başarıyla silindi!';
        clearTimeout(this.messageTimeout);
        this.messageTimeout = setTimeout(() => this.successMessage = null, 3000);

        // Verileri yenile (bu isLoading'i yönetecek)
        this.verileriYenile();
      },
      error: (err) => {
        // Hata durumunda yükleme durumunu kapat
        this.isLoading = false;
        this.errorMessage = 'Silme sırasında bir hata oluştu!';
      }
    });
  }

  getBolumler(): string[] {
    return Object.keys(this.istatistikler);
  }

  getTotalIsciSayisi(): number {
    return IstatistikHelper.getTotalIsciSayisi(this.istatistikler);
  }

  getBolumAdi(bolum: any): string {
    if (!bolum) return '';
    if (typeof bolum === 'string') {
      return bolum;
    }
    if (typeof bolum === 'object') {
      return bolum.bolumAdi || '';
    }
    return String(bolum);
  }

  getIsciYuzdesi(bolum: string): number {
    return IstatistikHelper.getIsciYuzdesi(bolum, this.istatistikler);
  }
}
