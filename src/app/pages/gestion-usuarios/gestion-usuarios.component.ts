import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../../pipes/filter.pipe';
import { LimitPipe } from '../../pipes/limit-pipe.pipe';
import { PaginatePipe } from '../../pipes/paginate.pipe';

import { Paciente } from '../../services/patient.service';
import { PatientService } from '../../services/patient.service';
import { PatientBenefitService, Paciente_Beneficio } from '../../services/patient-benefit.service';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterPipe, LimitPipe, PaginatePipe],
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.css']
})
export class GestionUsuariosComponent implements OnInit {
  currentPage = 1;
  selectedLimit = 5;
  filterPost = "";

  patients: Paciente[] = [];
  patientBenefits: Map<number, string> = new Map();

  newPatient: Partial<Paciente> = {};
  editPatient: Partial<Paciente> = {};
  isEditing = false;

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

  get filteredPatients() {
    const filtered = this.patients.filter(p =>
      p.fullName.toLowerCase().includes(this.filterPost.toLowerCase())
    );
    return filtered.slice((this.currentPage - 1) * this.selectedLimit, this.currentPage * this.selectedLimit);
  }

  get totalPages(): number {
    const filtered = this.patients.filter(p =>
      p.fullName.toLowerCase().includes(this.filterPost.toLowerCase())
    );
    return Math.ceil(filtered.length / this.selectedLimit);
  }

  openCreateModal(): void {
    this.newPatient = {};
    this.isEditing = false;
    const modal = document.getElementById('modal-agregar') as HTMLElement;
    if (modal && (modal as any).showPopover) {
      modal.showPopover();
    }
  }

  createPatient(): void {
    if (!this.newPatient.fullName || !this.newPatient.birthDate) {
      alert('Nombre y fecha de nacimiento son obligatorios');
      return;
    }

    this.patientService.create(this.newPatient as Paciente).subscribe({
      next: () => {
        this.loadPatients();
        const modal = document.getElementById('modal-agregar') as HTMLElement;
        if (modal && (modal as any).hidePopover) {
          modal.hidePopover();
        }
      },
      error: (err) => {
        console.error('Error al crear paciente:', err);
        alert('No se pudo crear el paciente');
      }
    });
  }

  openEditModal(patient: Paciente): void {
    this.editPatient = { ...patient };
    this.isEditing = true;
    const modal = document.getElementById('modal-editar') as HTMLElement;
    if (modal && (modal as any).showPopover) {
      modal.showPopover();
    }
  }

  updatePatient(): void {
    if (!this.editPatient.id) return;

    this.patientService.update(this.editPatient.id, this.editPatient as Paciente).subscribe({
      next: () => {
        this.loadPatients();
        const modal = document.getElementById('modal-editar') as HTMLElement;
        if (modal && (modal as any).hidePopover) {
          modal.hidePopover();
        }
      },
      error: (err) => {
        console.error('Error al actualizar paciente:', err);
        alert('No se pudo actualizar el paciente');
      }
    });
  }

  deletePatient(id: number): void {
    if (confirm('¿Estás seguro de eliminar este paciente?')) {
      this.patientService.delete(id).subscribe({
        next: () => {
          this.loadPatients();
        },
        error: (err) => {
          console.error('Error al eliminar paciente:', err);
          alert('No se pudo eliminar el paciente');
        }
      });
    }
  }
}