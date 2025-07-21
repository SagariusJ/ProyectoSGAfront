import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Dispersion } from '../../services/dispersion.service';
import { DispersionService } from '../../services/dispersion.service';
import { PatientService } from '../../services/patient.service';
import { Paciente } from '../../services/patient.service';

@Component({
  selector: 'app-dispersion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dispersion.component.html',
  styleUrls: ['./dispersion.component.css']
})
export class DispersionComponent implements OnInit {
  currentPage = 1;
  selectedLimit = 5;
  filterPost = "";

  dispersions: Dispersion[] = [];
  patientsMap: Map<number, Paciente> = new Map();

  newDispersion: Partial<Dispersion> = {};
  selectedPatientId: number | null = null;
  selectedDispersionId: number | null = null;

  showCreateModal = false;
  showDeleteModal = false;

  constructor(
    private dispersionService: DispersionService,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.loadPatients();
    this.loadDispersions();
  }

  // Cargar pacientes
  loadPatients(): void {
    this.patientService.getAll().subscribe({
      next: (patients) => {
        patients.forEach(p => {
          if (p.id) {
            this.patientsMap.set(p.id, p);
          }
        });
      },
      error: (err) => {
        console.error('Error al cargar pacientes:', err);
      }
    });
  }

  // Cargar dispersiones
  loadDispersions(): void {
    this.dispersionService.getAll().subscribe({
      next: (data) => {
        this.dispersions = data;
      },
      error: (err) => {
        console.error('Error al cargar dispersiones:', err);
      }
    });
  }

  // Obtener nombre del paciente
  getPatientName(pacienteId: number): string {
    return this.patientsMap.get(pacienteId)?.fullName || 'Desconocido';
  }

  // Filtro y paginación
  get filteredAndPaginatedDispersion(): Dispersion[] {
    const filtered = this.dispersions.filter(d =>
      d.productoId.toString().includes(this.filterPost.toLowerCase()) ||
      this.getPatientName(d.pacienteId).toLowerCase().includes(this.filterPost.toLowerCase())
    );

    const start = (this.currentPage - 1) * this.selectedLimit;
    const end = start + this.selectedLimit;

    return filtered.slice(start, end);
  }

  get totalPages(): number {
    const filtered = this.dispersions.filter(d =>
      d.productoId.toString().includes(this.filterPost.toLowerCase()) ||
      this.getPatientName(d.pacienteId).toLowerCase().includes(this.filterPost.toLowerCase())
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

  // Crear dispersión
  openCreateModal(): void {
    this.newDispersion = {};
    this.selectedPatientId = null;
    this.showCreateModal = true;
  }

  createDispersion(): void {
    if (!this.newDispersion.productoId || !this.selectedPatientId || !this.newDispersion.cantidad) {
      alert('Producto, paciente y cantidad son obligatorios');
      return;
    }

    this.newDispersion.pacienteId = this.selectedPatientId;

    this.dispersionService.create(this.newDispersion as Dispersion).subscribe({
      next: () => {
        this.loadDispersions();
        this.showCreateModal = false;
      },
      error: (err) => {
        console.error('Error al crear dispersión:', err);
        alert('No se pudo crear la dispersión');
      }
    });
  }

  // Eliminar dispersión
  confirmDelete(id: number | null): void {
    this.selectedDispersionId = id;
    this.showDeleteModal = true;
  }

  deleteDispersion(): void {
    if (!this.selectedDispersionId) return;

    this.dispersionService.delete(this.selectedDispersionId).subscribe({
      next: () => {
        this.loadDispersions();
        this.showDeleteModal = false;
      },
      error: (err) => {
        console.error('Error al eliminar dispersión:', err);
        alert('No se pudo eliminar la dispersión');
      }
    });
  }
}