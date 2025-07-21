import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Paciente } from '../../services/patient.service';
import { PatientService } from '../../services/patient.service';
import { PatientBenefitService, Paciente_Beneficio } from '../../services/patient-benefit.service';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.css']
})
export class GestionUsuariosComponent implements OnInit {
  // Paginación y filtrado
  currentPage = 1;
  selectedLimit = 5;
  filterPost = '';

  // Listas y mapeo
  patients: Paciente[] = [];
  patientBenefits: Map<number, string> = new Map();

  // Formularios
  newPatient: Partial<Paciente> = {};
  editPatient: Partial<Paciente> = {};

  // Selección y modales
  selectedPatient: Paciente | null = null;
  showDeleteModal = false;
  showCreateModal = false;
  showEditModal = false;

  constructor(
    private patientService: PatientService,
    private patientBenefitService: PatientBenefitService
  ) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.patientService.getAll().subscribe({
      next: (data) => {
        this.patients = data;
        this.loadBenefitsForPatients();
      },
      error: (err) => {
        console.error('Error al cargar pacientes:', err);
      }
    });
  }

  loadBenefitsForPatients(): void {
    this.patientBenefitService.getAll().subscribe({
      next: (benefits) => {
        benefits.forEach(pb => {
          if (pb.patient?.id && pb.benefit?.name) {
            this.patientBenefits.set(pb.patient.id, pb.benefit.name);
          }
        });
      },
      error: (err) => {
        console.error('Error al cargar beneficios:', err);
      }
    });
  }

  get filteredPatients(): Paciente[] {
    const filtered = this.patients.filter(p =>
      p.fullName.toLowerCase().includes(this.filterPost.toLowerCase())
    );
    const start = (this.currentPage - 1) * this.selectedLimit;
    const end = start + this.selectedLimit;
    return filtered.slice(start, end);
  }

  get totalPages(): number {
    const filtered = this.patients.filter(p =>
      p.fullName.toLowerCase().includes(this.filterPost.toLowerCase())
    );
    return Math.ceil(filtered.length / this.selectedLimit);
  }

  getPatientBenefitName(patientId: number): string {
    return this.patientBenefits.get(patientId) || 'Sin beneficio';
  }

  // Métodos para abrir/cerrar modales
  openDeleteModal(): void {
    if (this.selectedPatient) {
      this.showDeleteModal = true;
    }
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  openCreateModal(): void {
    this.newPatient = {};
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  openEditModal(patient: Paciente): void {
    this.editPatient = { ...patient };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  // CRUD de pacientes
  createPatient(): void {
    if (!this.newPatient.fullName || !this.newPatient.birthDate) {
      alert('Nombre y fecha de nacimiento son obligatorios');
      return;
    }

    this.patientService.create(this.newPatient as Paciente).subscribe({
      next: () => {
        this.loadPatients();
        this.closeCreateModal();
      },
      error: (err) => {
        console.error('Error al crear paciente:', err);
        alert('No se pudo crear el paciente');
      }
    });
  }

  updatePatient(): void {
    if (!this.editPatient.id) return;

    this.patientService.update(this.editPatient.id, this.editPatient as Paciente).subscribe({
      next: () => {
        this.loadPatients();
        this.closeEditModal();
      },
      error: (err) => {
        console.error('Error al actualizar paciente:', err);
        alert('No se pudo actualizar el paciente');
      }
    });
  }

  deletePatient(id: number): void {
    this.patientService.delete(id).subscribe({
      next: () => {
        this.loadPatients();
        this.closeDeleteModal();
      },
      error: (err) => {
        console.error('Error al eliminar paciente:', err);
        alert('No se pudo eliminar el paciente');
      }
    });
  }
}