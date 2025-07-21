import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Caja {
  id?: number;
  usuarioId: number;
  fechaApertura: string;
  fechaCierre: string;
  montoInicial: number;
  montoFinal: number;
}

export interface CajaUpdateRequest {
  fechaApertura: string;
  fechaCierre: string;
  montoInicial: number;
  montoFinal: number;
  usuarioId: number;
}

@Injectable({
  providedIn: 'root'
})
export class CajaService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    @Inject('API_URL') private apiUrl: string
  ) {
    this.baseUrl = `${this.apiUrl}/api/caja`;
  }

  create(caja: Caja): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/create`, caja);
  }

  getAll(): Observable<Caja[]> {
    return this.http.get<Caja[]>(`${this.baseUrl}/all`);
  }

  getById(id: number): Observable<Caja> {
    return this.http.get<Caja>(`${this.baseUrl}/search/${id}`);
  }

  update(id: number, cajaDetails: CajaUpdateRequest): Observable<Caja> {
    return this.http.put<Caja>(`${this.baseUrl}/update/${id}`, cajaDetails);
  }

  delete(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, { responseType: 'text' });
  }
}