export interface BolumIstatistik {
  [key: string]: number;
}

export class IstatistikHelper {

  /**
   * Toplam işçi sayısını hesaplar
   */
  static getTotalIsciSayisi(istatistikler: BolumIstatistik): number {
    return Object.values(istatistikler).reduce((a, b) => a + b, 0);
  }

  /**
   * Belirli bir bölümdeki işçi yüzdesini hesaplar
   */
  static getIsciYuzdesi(bolum: string, istatistikler: BolumIstatistik): number {
    const total = this.getTotalIsciSayisi(istatistikler);
    if (!total) return 0;
    return (istatistikler[bolum] / total) * 100;
  }
}
