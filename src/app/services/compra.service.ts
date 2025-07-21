import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Provider } from './provider.service';

export interface CompraDetail {
  id?: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
}

export interface Compra {
  id?: number;
  provider: Provider;
  fecha: string;
  total: number;
  details: CompraDetail[];
}

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    @Inject('API_URL') private apiUrl: string
  ) {
    this.baseUrl = `${this.apiUrl}/api/compra`;
  }

  create(compra: Compra): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/create`, compra);
  }

  getAll(): Observable<Compra[]> {
    return this.http.get<Compra[]>(`${this.baseUrl}/all`);
  }

  getById(id: number): Observable<Compra> {
    return this.http.get<Compra>(`${this.baseUrl}/search/${id}`);
  }

  delete(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, { responseType: 'text' });
  }
}