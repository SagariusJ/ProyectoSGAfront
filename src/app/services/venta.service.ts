// src/app/services/venta.service.ts

import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VentaDetail } from './venta-detail.service';

export interface Venta {
  id?: number;
  user_id: number;
  saleDate: string;    // ISO date format, e.g. "2025-07-18"
  cost: number;
  details?: VentaDetail[];
}

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    @Inject('API_URL') private apiUrl: string
  ) {
    this.baseUrl = `${this.apiUrl}/api/venta`;
  }

  /** Registra una nueva venta */
  create(venta: Venta): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/create`, venta);
  }

  /** Obtiene todas las ventas */
  getAll(): Observable<Venta[]> {
    return this.http.get<Venta[]>(`${this.baseUrl}/all`);
  }

  /** Busca una venta por su ID */
  getById(id: number): Observable<Venta> {
    return this.http.get<Venta>(`${this.baseUrl}/search/${id}`);
  }

  /** Elimina una venta por su ID */
  delete(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, {
      responseType: 'text'
    });
  }
}
