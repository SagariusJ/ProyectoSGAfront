import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../../pipes/filter.pipe';
import { LimitPipe } from '../../pipes/limit-pipe.pipe';
import { PaginatePipe } from '../../pipes/paginate.pipe';
import { BenefitService, Beneficio } from '../../services/benefit.service';

@Component({
  selector: 'app-beneficios',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterPipe, LimitPipe, PaginatePipe],
  templateUrl: './beneficios.component.html',
  styleUrls: ['./beneficios.component.css']
})
export class BeneficiosComponent implements OnInit {
  beneficios: Beneficio[] = [];
  filterPost = '';
  selectedLimit = 5;
  currentPage = 1;

  beneficio_name = '';
  descripcion_benef = '';
  descuento_benef = 0;

  beneficioEliminarId: number | null = null;

  constructor(private beneficioService: BenefitService) {}

  ngOnInit(): void {
    this.cargarBeneficios();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredPosts.length / this.selectedLimit);
  }

  get filteredPosts(): Beneficio[] {
    return this.beneficios.filter(b =>
      b.name.toLowerCase().includes(this.filterPost.toLowerCase()) ||
      b.description.toLowerCase().includes(this.filterPost.toLowerCase())
    ).slice(
      (this.currentPage - 1) * this.selectedLimit,
      this.currentPage * this.selectedLimit
    );
  }

  cargarBeneficios(): void {
    this.beneficioService.getAll().subscribe({
      next: (data) => this.beneficios = data,
      error: (err) => console.error('Error al cargar beneficios', err)
    });
  }

  agregarBeneficio(): void {
    if (!this.beneficio_name || !this.descripcion_benef || this.descuento_benef <= 0) {
      alert('Todos los campos son obligatorios');
      return;
    }

    const nuevoBeneficio: Beneficio = {
      id: 0, // el backend debe asignar el id
      name: this.beneficio_name,
      discount: this.descuento_benef,
      description: this.descripcion_benef
    };

    this.beneficioService.create(nuevoBeneficio).subscribe({
      next: () => {
        this.beneficio_name = '';
        this.descripcion_benef = '';
        this.descuento_benef = 0;
        this.cargarBeneficios();
      },
      error: (err) => console.error('Error al agregar beneficio', err)
    });
  }

  seleccionarBeneficioEliminar(id: number): void {
    this.beneficioEliminarId = id;
  }

  eliminarBeneficio(): void {
    if (this.beneficioEliminarId !== null) {
      this.beneficioService.delete(this.beneficioEliminarId).subscribe({
        next: () => {
          this.beneficioEliminarId = null;
          this.cargarBeneficios();
        },
        error: (err) => console.error('Error al eliminar beneficio', err)
      });
    }
  }
}