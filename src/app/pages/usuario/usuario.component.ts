import { Component, OnInit } from '@angular/core';
import { UsuarioService, User } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  user?: User;
  previewImage: string = '';
  private baseUrl: string;

  constructor(
    private usuarioService: UsuarioService,
    private http: HttpClient
  ) {
    this.baseUrl = `${usuarioService['apiUrl']}/api/auth`; // acceder a apiUrl inyectado
  }

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No se encontró token');
      return;
    }

    const payload = this.decodeJWT(token);
    const username = payload?.sub;

    if (!username) {
      console.error('No se pudo extraer el nombre de usuario del token');
      return;
    }

    this.http.get<User[]>(`${this.baseUrl}/admin/users`).subscribe({
      next: (users) => {
        const matchedUser = users.find(u => u.username === username);
        if (matchedUser) {
          this.user = matchedUser;
          this.setUserDataInHTML(matchedUser);
        } else {
          console.error('Usuario no encontrado en la lista');
        }
      },
      error: (err) => console.error('Error cargando usuarios', err)
    });
  }

  decodeJWT(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error('Error al decodificar token JWT', e);
      return null;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.previewImage = reader.result as string;
      const previewImg = document.getElementById('preview') as HTMLImageElement;
      if (previewImg) previewImg.src = this.previewImage;
    };
    reader.readAsDataURL(file);
  }

  private setUserDataInHTML(user: User): void {
    const nombre = document.getElementById('nombre-usuario');
    if (nombre) nombre.textContent = user.fullName;

    const datos = document.querySelectorAll('.data-datos');
    if (datos.length >= 5) {
      datos[0].textContent = user.role || 'No especificado';
      datos[1].textContent = user.birthDate || 'No especificado';
      datos[2].textContent = user.region || 'No especificado';
      datos[3].textContent = user.commune || 'No especificado';
      datos[4].textContent = user.address || 'No especificado';
    }
  }
}
