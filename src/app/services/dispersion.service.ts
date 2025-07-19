import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Dispersion {
  id?: number;
  productoId: number;
  pacienteId: number;
  cantidad: number;
  fecha: string; // Usamos string para compatibilidad con JSON
}

@Injectable({
  providedIn: 'root'
})
export class DispersionService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    @Inject('API_URL') private apiUrl: string
  ) {
    this.baseUrl = `${this.apiUrl}/api/dispersion`;
  }

  create(dispersion: Dispersion): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/create`, dispersion);
  }

  getAll(): Observable<Dispersion[]> {
    return this.http.get<Dispersion[]>(`${this.baseUrl}/all`);
  }

  getById(id: number): Observable<Dispersion> {
    return this.http.get<Dispersion>(`${this.baseUrl}/search/${id}`);
  }

  delete(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, { responseType: 'text' });
  }

  // Métodos adicionales útiles
  getByProductoId(productoId: number): Observable<Dispersion[]> {
    return this.http.get<Dispersion[]>(`${this.baseUrl}/by-producto/${productoId}`);
  }

  getByPacienteId(pacienteId: number): Observable<Dispersion[]> {
    return this.http.get<Dispersion[]>(`${this.baseUrl}/by-paciente/${pacienteId}`);
  }

  getByFecha(fecha: string): Observable<Dispersion[]> {
    return this.http.get<Dispersion[]>(`${this.baseUrl}/by-fecha`, {
      params: { fecha }
    });
  }
}