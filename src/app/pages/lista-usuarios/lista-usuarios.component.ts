import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../../pipes/filter.pipe';
import { LimitPipe } from '../../pipes/limit-pipe.pipe';
import { PaginatePipe } from '../../pipes/paginate.pipe';

import { User, UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterPipe, LimitPipe, PaginatePipe],
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.css']
})
export class ListaUsuariosComponent implements OnInit {
  currentPage = 1;
  selectedLimit = 5;
  filterPost = "";

  users: User[] = [];
  newRole: string = 'user'; // valor por defecto
  selectedUser: User | null = null;
  selectedUserId: number | null = null;

  showDeleteModal = false;
  showEditRoleModal = false;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.usuarioService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      }
    });
  }

  get filteredUsers() {
    const filtered = this.users.filter(user =>
      user.fullName?.toLowerCase().includes(this.filterPost.toLowerCase()) ||
      user.username?.toLowerCase().includes(this.filterPost.toLowerCase()) ||
      user.email?.toLowerCase().includes(this.filterPost.toLowerCase())
    );
    return filtered.slice((this.currentPage - 1) * this.selectedLimit, this.currentPage * this.selectedLimit);
  }

  get totalPages(): number {
    const filtered = this.users.filter(user =>
      user.fullName?.toLowerCase().includes(this.filterPost.toLowerCase()) ||
      user.username?.toLowerCase().includes(this.filterPost.toLowerCase()) ||
      user.email?.toLowerCase().includes(this.filterPost.toLowerCase())
    );
    return Math.ceil(filtered.length / this.selectedLimit);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  onLimitChange(): void {
    this.currentPage = 1;
  }

  onFilterChange(): void {
    this.currentPage = 1;
  }

  // Abrir modal de edición de rol
  openEditRoleModal(user: User | null): void {
    if (!user) return; // Salimos si es null

    this.selectedUser = user;
    this.selectedUserId = user.id ?? null;
    this.newRole = user.role ?? 'user';
    this.showEditRoleModal = true;
  }

  // Actualizar rol del usuario
  updateRole(): void {
    if (!this.selectedUserId) return;

    this.usuarioService.updateUserRole(this.selectedUserId, this.newRole).subscribe({
      next: () => {
        this.loadUsers();
        this.showEditRoleModal = false;
      },
      error: (err) => {
        console.error('Error al actualizar rol:', err);
        alert('No se pudo actualizar el rol');
      }
    });
  }

  // Eliminar usuario
  confirmDelete(): void {
    if (this.selectedUser) {
      this.selectedUserId = this.selectedUser.id;
      this.showDeleteModal = true;
    }
  } 

  deleteUser(): void {
    if (!this.selectedUserId) return;

    this.usuarioService.deleteUser(this.selectedUserId).subscribe({
      next: () => {
        this.loadUsers();
        this.showDeleteModal = false;
      },
      error: (err) => {
        console.error('Error al eliminar usuario:', err);
        alert('No se pudo eliminar el usuario');
      }
    });
  }
}