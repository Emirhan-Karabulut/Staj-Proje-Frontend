import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IsciService {
  private apiUrl = environment.apiUrl + '/isciler';
  private istatistikUrl = environment.apiUrl + '/istatistikler';
  private bolumlerUrl = environment.apiUrl + '/bolumler';

  constructor(private http: HttpClient) {}

  ekleIsci(i: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/ekle`, i, { withCredentials: true });
  }

  listeleTum(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/hepsi`, { withCredentials: true });
  }

  silIsci(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/sil/${id}`, { withCredentials: true });
  }

  getBolumIstatistikleri(): Observable<any> {
    return this.http.get<any>(`${this.istatistikUrl}/bolumler`, { withCredentials: true });
  }

  getBolumler(): Observable<any[]> {
    return this.http.get<any[]>(`${this.bolumlerUrl}/hepsi`, { withCredentials: true });
  }

  getIsciById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  guncelleIsci(id: number, isci: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, isci, { withCredentials: true });
  }
}
