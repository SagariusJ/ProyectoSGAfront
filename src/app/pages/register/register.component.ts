import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { UsuarioService, RegisterRequest } from '../../services/usuario.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  fullName = '';
  email = '';
  birthDate = '';
  region = '';
  commune = '';
  address = '';
  password = '';
  errorMessage = '';

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  onRegister(): void {
    const request: RegisterRequest = {
      username: this.email,
      password: this.password,
      fullName: this.fullName,
      email: this.email,
      birthDate: this.birthDate,
      region: this.region,
      commune: this.commune,
      address: this.address
    };

    this.usuarioService.register(request).subscribe({
      next: (response) => {
        console.log('Respuesta exitosa:', response);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error en el registro:', err);
        this.errorMessage = 'Error al registrarse';
      }
    });
  }
}
