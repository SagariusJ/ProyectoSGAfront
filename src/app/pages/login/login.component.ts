import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { UsuarioService, LoginRequest, LoginResponse } from '../../services/usuario.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  onLogin(): void {
    const request: LoginRequest = {
      username: this.username,
      password: this.password
    };

    this.usuarioService.login(request).subscribe({
      next: (response: LoginResponse) => {
        localStorage.setItem('authToken', response.token);
        window.location.reload(); // Refresca para que el navbar se actualice
      },
      error: () => {
        this.errorMessage = 'Credenciales inválidas';
      }
    });
  }
}