import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Provider {
  id?: number;
  nombre: string;
  contacto: string;
  compras?: any[]; // Puedes reemplazar 'any' con una interfaz más específica si es necesario
}

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    @Inject('API_URL') private apiUrl: string
  ) {
    this.baseUrl = `${this.apiUrl}/api/proveedor`;
  }

  create(provider: Provider): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/create`, provider);
  }

  getAll(): Observable<Provider[]> {
    return this.http.get<Provider[]>(`${this.baseUrl}/all`);
  }

  getById(id: number): Observable<Provider> {
    return this.http.get<Provider>(`${this.baseUrl}/search/${id}`);
  }

  delete(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, { responseType: 'text' });
  }
}