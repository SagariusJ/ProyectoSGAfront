// src/app/services/venta-detail.service.ts

import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venta } from './venta.service';

export interface VentaDetail {
  id?: number;
  sale: Venta;
  producto_id: number;
  amount: number;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class VentaDetailService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    @Inject('API_URL') private apiUrl: string
  ) {
    this.baseUrl = `${this.apiUrl}/api/ventadet`;
  }

  /** Registra un nuevo detalle de venta */
  create(detail: VentaDetail): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/create`, detail);
  }

  /** Obtiene todos los detalles de venta */
  getAll(): Observable<VentaDetail[]> {
    return this.http.get<VentaDetail[]>(`${this.baseUrl}/all`);
  }

  /** Busca un detalle de venta por ID */
  getById(id: number): Observable<VentaDetail> {
    return this.http.get<VentaDetail>(`${this.baseUrl}/search/${id}`);
  }

  /** Elimina un detalle de venta por ID */
  delete(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, {
      responseType: 'text'
    });
  }
}
