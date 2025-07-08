import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../pipes/filter.pipe';
import { LimitPipe } from '../pipes/limit.pipe';
import { PaginatePipe } from '../pipes/paginate.pipe';

interface Usuario {
  id: number;
  nombre: string;
  edad: number;
  direccion: string;
  comuna: string;
  n_beneficios: number;
}

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterPipe, LimitPipe, PaginatePipe],
  templateUrl: './gestion-usuarios.component.html',
  styleUrl: './gestion-usuarios.component.css'
})
export class GestionUsuariosComponent {
  usuarios: Usuario[] = [
    { id: 1, nombre: 'María Pérez', edad: 34, direccion: 'Calle A #123', comuna: 'Ñuñoa', n_beneficios: 2 },
    { id: 2, nombre: 'Juan Soto', edad: 45, direccion: 'Calle B #456', comuna: 'Providencia', n_beneficios: 1 },
    { id: 3, nombre: 'Camila Díaz', edad: 29, direccion: 'Calle C #789', comuna: 'La Reina', n_beneficios: 3 },
    // ... puedes agregar más usuarios
  ];

  // Estado de los controles
  filterPost: string = '';
  selectedLimit: number = 5;
  currentPage: number = 1;

  // Para formularios popup
  productIdToDelete: number | null = null;
  newUser: Partial<Usuario> = {};
  selectedUserForBenefit: Usuario | null = null;

  get totalPages(): number {
    const total = this.filteredPosts.length;
    return Math.ceil(total / this.selectedLimit);
  }

  get filteredPosts(): Usuario[] {
    let filtered = this.usuarios;

    if (this.filterPost && this.filterPost.length >= 4) {
      const search = this.filterPost.toLowerCase();
      filtered = filtered.filter(post =>
        post.nombre.toLowerCase().includes(search) ||
        post.direccion.toLowerCase().includes(search) ||
        post.comuna.toLowerCase().includes(search)
      );
    }

    const start = (this.currentPage - 1) * this.selectedLimit;
    return filtered.slice(start, start + this.selectedLimit);
  }

  // --- CRUD Simulado ---
  addProduct(): void {
    if (
      this.newUser.nombre &&
      this.newUser.edad &&
      this.newUser.direccion &&
      this.newUser.comuna
    ) {
      const id = this.usuarios.length > 0 ? Math.max(...this.usuarios.map(u => u.id)) + 1 : 1;
      const nuevo: Usuario = {
        id,
        nombre: this.newUser.nombre,
        edad: this.newUser.edad,
        direccion: this.newUser.direccion,
        comuna: this.newUser.comuna,
        n_beneficios: 0
      };
      this.usuarios.push(nuevo);
      this.newUser = {};
    }
  }

  deleteProduct(): void {
    if (this.productIdToDelete !== null) {
      this.usuarios = this.usuarios.filter(u => u.id !== this.productIdToDelete);
      this.productIdToDelete = null;
    }
  }

  openEditPopup(user: Usuario): void {
    this.selectedUserForBenefit = user;
  }

  addBenefit(): void {
    if (this.selectedUserForBenefit) {
      this.selectedUserForBenefit.n_beneficios += 1;
      this.selectedUserForBenefit = null;
    }
  }

  removeBenefit(): void {
    if (this.selectedUserForBenefit && this.selectedUserForBenefit.n_beneficios > 0) {
      this.selectedUserForBenefit.n_beneficios -= 1;
      this.selectedUserForBenefit = null;
    }
  }

  setUserIdToDelete(id: number): void {
    this.productIdToDelete = id;
  }
}