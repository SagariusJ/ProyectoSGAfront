import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../../pipes/filter.pipe';
import { LimitPipe } from '../../pipes/limit-pipe.pipe';
import { PaginatePipe } from '../../pipes/paginate.pipe';

import { Dispersion } from '../../services/dispersion.service';
import { DispersionService } from '../../services/dispersion.service';
import { PatientService } from '../../services/patient.service';
import { Paciente } from '../../services/patient.service';

@Component({
  selector: 'app-dispersion',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterPipe, LimitPipe, PaginatePipe],
  templateUrl: './dispersion.component.html',
  styleUrls: ['./dispersion.component.css']
})
export class DispersionComponent implements OnInit {
  currentPage = 1;
  selectedLimit = 5;
  filterPost = "";

  dispersions: Dispersion[] = [];
  patientsMap: Map<number, Paciente> = new Map();
  filteredAndPaginatedDispersion: Dispersion[] = [];

  newDispersion: Partial<Dispersion> = {};
  editDispersion: Partial<Dispersion> = {};
  selectedPatientId: number | null = null;
  selectedDispersionId: number | null = null;

  constructor(
    private dispersionService: DispersionService,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.loadPatients();
    this.loadDispersions();
  }

  loadPatients(): void {
    this.patientService.getAll().subscribe({
      next: (patients) => {
        patients.forEach(p => {
          this.patientsMap.set(p.id!, p);
        });
      },
      error: (err) => {
        console.error('Error al cargar pacientes:', err);
      }
    });
  }

  loadDispersions(): void {
    this.dispersionService.getAll().subscribe({
      next: (data) => {
        this.dispersions = data;
        this.updateFilteredAndPaginatedList();
      },
      error: (err) => {
        console.error('Error al cargar dispersiones:', err);
      }
    });
  }

  updateFilteredAndPaginatedList(): void {
    const filtered = this.dispersions.filter(d =>
      d.productoId.toString().includes(this.filterPost.toLowerCase()) ||
      this.getPatientName(d.pacienteId).toLowerCase().includes(this.filterPost.toLowerCase())
    );

    const paginated = filtered.slice(
      (this.currentPage - 1) * this.selectedLimit,
      this.currentPage * this.selectedLimit
    );

    this.filteredAndPaginatedDispersion = paginated;
  }

  getPatientName(pacienteId: number): string {
    return this.patientsMap.get(pacienteId)?.fullName || 'Desconocido';
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
      this.updateFilteredAndPaginatedList();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateFilteredAndPaginatedList();
    }
  }

  onLimitChange(): void {
    this.currentPage = 1;
    this.updateFilteredAndPaginatedList();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.updateFilteredAndPaginatedList();
  }
}