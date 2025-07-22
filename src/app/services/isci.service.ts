import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = "https://staj-proje-production.up.railway.app/api/isciler";
const ISTATISTIK_URL = "https://staj-proje-production.up.railway.app/api/istatistikler";
const BOLUMLER_URL = "https://staj-proje-production.up.railway.app/api/bolumler";

@Injectable({
  providedIn: 'root'
})
export class IsciService {
  constructor(private http: HttpClient) {}

  ekleIsci(i: any): Observable<any> {
    return this.http.post<any>(`${API_URL}/ekle`, i, { withCredentials: true });
  }

  listeleTum(): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/hepsi`, { withCredentials: true });
  }

  silIsci(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/sil/${id}`, { withCredentials: true });
  }

  getBolumIstatistikleri(): Observable<any> {
    return this.http.get<any>(`${ISTATISTIK_URL}/bolumler`, { withCredentials: true });
  }

  getBolumler(): Observable<any[]> {
    return this.http.get<any[]>(`${BOLUMLER_URL}/hepsi`, { withCredentials: true });
  }

  getIsciById(id: number): Observable<any> {
    return this.http.get<any>(`${API_URL}/${id}`, { withCredentials: true });
  }

  guncelleIsci(id: number, isci: any): Observable<any> {
    return this.http.put<any>(`${API_URL}/${id}`, isci, { withCredentials: true });
  }
}
