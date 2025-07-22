import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bolum } from '../models/bolum.model';
import { Isci } from '../models/isci.model';
import { BolumIstatistik } from '../models/istatistik.model';
import {environment} from '../../environment';

@Injectable({ providedIn: 'root' })
export class IsciService {
  private apiUrl = `${environment.apiUrl}/isciler`;
  private istatistikUrl = `${environment.apiUrl}/istatistikler`;
  private bolumlerUrl = `${environment.apiUrl}/bolumler`;

  constructor(private http: HttpClient) {}

  ekleIsci(i: Isci): Observable<Isci> {
    return this.http.post<Isci>(`${this.apiUrl}/ekle`, i, { withCredentials: true });
  }

  listeleTum(): Observable<Isci[]> {
    return this.http.get<Isci[]>(`${this.apiUrl}/hepsi`, { withCredentials: true });
  }

  silIsci(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/sil/${id}`, { withCredentials: true });
  }

  getBolumIstatistikleri(): Observable<BolumIstatistik> {
    return this.http.get<BolumIstatistik>(`${this.istatistikUrl}/bolumler`, { withCredentials: true });
  }

  getBolumler(): Observable<Bolum[]> {
    return this.http.get<Bolum[]>(`${this.bolumlerUrl}/hepsi`, { withCredentials: true });
  }

  getIsciById(id: number): Observable<Isci> {
    return this.http.get<Isci>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  guncelleIsci(id: number, isci: Isci): Observable<Isci> {
    return this.http.put<Isci>(`${this.apiUrl}/${id}`, isci, { withCredentials: true });
  }
}
