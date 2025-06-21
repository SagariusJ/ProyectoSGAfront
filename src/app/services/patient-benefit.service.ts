import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paciente } from './patient.service';
import { Beneficio } from './benefit.service';

export interface Paciente_Beneficio{
  id: number;
  patient: Paciente;
  benefit: Beneficio;
}

@Injectable({
  providedIn: 'root'
})
export class PatientBenefitService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    @Inject('API_URL') private apiUrl: string
  ) {
    this.baseUrl = `${this.apiUrl}/patben`;
    }

  create(patben: Paciente_Beneficio): Observable<void> {
      return this.http.post<void>(`${this.baseUrl}/create`, patben);
  }

  getAll(): Observable<Paciente_Beneficio[]> {
    return this.http.get<Paciente_Beneficio[]>(`${this.baseUrl}/all`);
  }
  
  getById(id: number): Observable<Paciente_Beneficio> {
    return this.http.get<Paciente_Beneficio>(`${this.baseUrl}/search/${id}`);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, { responseType: 'text' });
  }
}