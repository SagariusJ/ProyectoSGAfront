import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compra } from './compra.service';

export interface CompraDetail {
  id?: number;
  compra: Compra | number; // Puede ser el objeto completo o solo el ID
  productoId: number;
  inventory_number: string;
  amount: number;
  precio: number;
}

@Injectable({
  providedIn: 'root'
})
export class CompraDetailService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    @Inject('API_URL') private apiUrl: string
  ) {
    this.baseUrl = `${this.apiUrl}/api/compradet`;
  }

  create(compraDetail: CompraDetail): Observable<void> {
    const payload = {
      ...compraDetail,
      compra: typeof compraDetail.compra === 'number' ? compraDetail.compra : compraDetail.compra.id
    };
    return this.http.post<void>(`${this.baseUrl}/create`, payload);
  }

  getAll(): Observable<CompraDetail[]> {
    return this.http.get<CompraDetail[]>(`${this.baseUrl}/all`);
  }

  getById(id: number): Observable<CompraDetail> {
    return this.http.get<CompraDetail>(`${this.baseUrl}/search/${id}`);
  }

  delete(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, { responseType: 'text' });
  }

}