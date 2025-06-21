import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Warehouse {
  id?: number;
  warehouse_Name: string;
  direction: string;
}

@Injectable({
  providedIn: 'root'
})
export class SucursalService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    @Inject('API_URL') private apiUrl: string
  ) {
    this.baseUrl = `${this.apiUrl}/api/warehouse`;
    }

  create(warehouse: Warehouse): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/create`, warehouse);
  }

  getAll(): Observable<Warehouse[]> {
      return this.http.get<Warehouse[]>(`${this.baseUrl}/all`);
    }
  
  getById(id: number): Observable<Warehouse> {
    return this.http.get<Warehouse>(`${this.baseUrl}/search/${id}`);
  }
  
  update(id: number, warehouse: Warehouse): Observable<Warehouse> {
    return this.http.put<Warehouse>(`${this.baseUrl}/update/${id}`, warehouse);
  }
  
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, { responseType: 'text' });
  }
}