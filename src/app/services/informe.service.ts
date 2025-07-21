// src/app/services/informe.service.ts
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Informe } from '../models/informe';

export interface CompraDTO {
  // Define las propiedades según tu backend
  id: number;
  proveedor: string;
  monto: number;
  fecha: string;
}

export interface VentaDTO {
  // Define las propiedades según tu backend
  id: number;
  cliente: string;
  monto: number;
  fecha: string;
}

@Injectable({
  providedIn: 'root'
})
export class InformeService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    @Inject('API_URL') private apiUrl: string
  ) {
    this.baseUrl = `${this.apiUrl}/api/informe`;
  }

  /**
   * Descarga el informe diario en formato PDF
   */
  downloadDailyReport(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/pdf`, {
      responseType: 'blob' // Para manejar archivos binarios
    });
  }

  /**
   * Obtiene los datos del informe (sin PDF)
   */
  getInformeData(): Observable<Informe> {
    return this.http.get<Informe>(`${this.baseUrl}/data`);
  }
}