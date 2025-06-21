import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Paciente {
  id: number;
  fullName: string;
  birthDate: string;
  region: string;
  commune: string;
  address: string;
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    @Inject('API_URL') private apiUrl: string
  ) {
    this.baseUrl = `${this.apiUrl}/patients`;
    }

    create(paciente: Paciente): Observable<void> {
      return this.http.post<void>(`${this.baseUrl}/create`, paciente);
    }

    getAll(): Observable<Paciente[]> {
      return this.http.get<Paciente[]>(`${this.baseUrl}/all`);
    }
      
    getById(id: number): Observable<Paciente> {
      return this.http.get<Paciente>(`${this.baseUrl}/search/${id}`);
    }
    
    delete(id: number): Observable<any> {
      return this.http.delete(`${this.baseUrl}/delete/${id}`, { responseType: 'text' });
    }

    update(id: number, paciente: Paciente): Observable<Paciente> {
      return this.http.put<Paciente>(`${this.baseUrl}/update/${id}`, paciente);
    }
}