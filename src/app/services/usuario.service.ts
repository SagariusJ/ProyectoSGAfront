import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  username: string;
  password: string;
  fullName: string;
  email: string;
  birthDate: string;
  region: string;
  commune: string;
  address: string;
  role: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  fullName: string;
  email: string;
  birthDate: string;
  region: string;
  commune: string;
  address: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private baseUrl: string;

  constructor(
    private http: HttpClient,
    @Inject('API_URL') private apiUrl: string
  ) {
    this.baseUrl = `${this.apiUrl}/api/auth`;
  }

  register(request: RegisterRequest): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/register`, request);
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, request);
  }

  editProfile(request: RegisterRequest): Observable<string> {
    return this.http.put<string>(`${this.baseUrl}/edit-profile`, request);
  }

  whoami(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/whoami`);
  }

  updateUserRole(userId: number, role: string): Observable<string> {
    const params = new HttpParams().set('role', role);
    return this.http.put<string>(`${this.baseUrl}/admin/update-role/${userId}`, null, { params });
  }

  deleteUser(userId: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/admin/delete/${userId}`);
  }

  updateUserData(userId: number, updatedData: RegisterRequest): Observable<string> {
    return this.http.put<string>(`${this.baseUrl}/admin/update-user/${userId}`, updatedData);
  }

  // 📄 Obtener todos los usuarios (admin)
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/admin/users`);
  }

}
