// src/app/services/beneficio.service.ts
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Beneficio {
  id: number;
  name: string;
  discount: number;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class BenefitService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    @Inject('API_URL') private apiUrl: string
  ) {
    this.baseUrl = `${this.apiUrl}/api/benefits`;
    }

  create(beneficio: Beneficio): Observable<void> {
      return this.http.post<void>(`${this.baseUrl}/create`, beneficio);
  }

  getAll(): Observable<Beneficio[]> {
    return this.http.get<Beneficio[]>(`${this.baseUrl}/all`);
  }
  
  getById(id: number): Observable<Beneficio> {
    return this.http.get<Beneficio>(`${this.baseUrl}/search/${id}`);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, { responseType: 'text' });
  }
}