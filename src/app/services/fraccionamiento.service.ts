import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Fraccionamiento {
  id?: number;
  productoId: number;
  cantidad: number;
  sucursalOrigenId: number;
  sucursalDestinoId: number;
  fecha: string;
}

@Injectable({
  providedIn: 'root'
})
export class FraccionamientoService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    @Inject('API_URL') private apiUrl: string
  ) {
    this.baseUrl = `${this.apiUrl}/api/fraccionamiento`;
  }

  create(fraccionamiento: Fraccionamiento): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/create`, fraccionamiento);
  }

  getAll(): Observable<Fraccionamiento[]> {
    return this.http.get<Fraccionamiento[]>(`${this.baseUrl}/all`);
  }

  getById(id: number): Observable<Fraccionamiento> {
    return this.http.get<Fraccionamiento>(`${this.baseUrl}/search/${id}`);
  }

  delete(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, { responseType: 'text' });
  }

  getByProductoId(productoId: number): Observable<Fraccionamiento[]> {
    return this.http.get<Fraccionamiento[]>(`${this.baseUrl}/by-producto/${productoId}`);
  }

  getBySucursalOrigen(sucursalId: number): Observable<Fraccionamiento[]> {
    return this.http.get<Fraccionamiento[]>(`${this.baseUrl}/by-origen/${sucursalId}`);
  }

  getBySucursalDestino(sucursalId: number): Observable<Fraccionamiento[]> {
    return this.http.get<Fraccionamiento[]>(`${this.baseUrl}/by-destino/${sucursalId}`);
  }

  getByUsuarioId(usuarioId: number): Observable<Fraccionamiento[]> {
    return this.http.get<Fraccionamiento[]>(`${this.baseUrl}/by-usuario/${usuarioId}`);
  }

  getByFecha(fecha: string): Observable<Fraccionamiento[]> {
    return this.http.get<Fraccionamiento[]>(`${this.baseUrl}/by-fecha`, {
      params: { fecha }
    });
  }
}