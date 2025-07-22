export class Bolum {
  id?: number;
  bolumAdi: string = '';

  constructor(data?: Partial<Bolum>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
