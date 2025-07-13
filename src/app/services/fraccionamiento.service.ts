import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FraccionamientoService {
  private apiUrl = 'URL_DE_TU_BACKEND/fraccionamientos';

  constructor(private http: HttpClient) { }

  realizarTransferencia(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}