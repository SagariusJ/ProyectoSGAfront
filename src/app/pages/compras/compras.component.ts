import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../../pipes/filter.pipe';
import { LimitPipe } from '../../pipes/limit-pipe.pipe';
import { PaginatePipe } from '../../pipes/paginate.pipe';

import { CompraService, Compra } from '../../services/compra.service';
import { ProviderService, Provider } from '../../services/provider.service';
import { CompraDetailService, CompraDetail } from '../../services/compra-detail.service';

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterPipe, LimitPipe, PaginatePipe],
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent implements OnInit {
  currentPage = 1;
  selectedLimit = 5;
  filterText = '';

  compras: Compra[] = [];
  proveedores: Provider[] = [];

  newCompra: { provider: Provider | undefined; fecha: string } = {
    provider: undefined,
    fecha: new Date().toISOString().split('T')[0]
  };

  constructor(
    private compraService: CompraService,
    private providerService: ProviderService,
    private compraDetailService: CompraDetailService
  ) {}

  ngOnInit(): void {
    this.loadCompras();
    this.loadProveedores();
  }

  loadCompras(): void {
    this.compraService.getAll().subscribe(data => {
      this.compras = data;
    });
  }

  loadProveedores(): void {
    this.providerService.getAll().subscribe(data => {
      this.proveedores = data;
    });
  }

  get filteredCompras(): Compra[] {
    return this.compras.filter(compra =>
      compra.provider.nombre.toLowerCase().includes(this.filterText.toLowerCase())
    );
  }

  get totalPages(): number {
    const totalItems = this.filteredCompras.length;
    return Math.ceil((totalItems || 1) / this.selectedLimit);
  }

  get paginatedCompras(): Compra[] {
    const start = (this.currentPage - 1) * this.selectedLimit;
    return this.filteredCompras.slice(start, start + this.selectedLimit);
  }

  createCompra(): void {
    const providerId = this.newCompra.provider?.id;

    if (!providerId) {
      alert('Por favor seleccione un proveedor.');
      return;
    }

    // Obtener el objeto completo del proveedor
    this.providerService.getById(providerId).subscribe(provider => {
      const nuevaCompra: Compra = {
        provider: provider,
        fecha: this.newCompra.fecha,
        total: 0,
        details: []
      };

      this.compraService.create(nuevaCompra).subscribe(() => {
        this.loadCompras();

        // Buscar la última compra para obtener su ID
        this.compraService.getAll().subscribe(compras => {
          const ultimaCompra = compras[compras.length - 1];

          if (ultimaCompra && ultimaCompra.id) {
            const nuevoDetalle: CompraDetail = {
              compra: ultimaCompra.id,
              productoId: 1,
              inventory_number: 'INV-001',
              amount: 1,
              precio: 0
            };

            this.compraDetailService.create(nuevoDetalle).subscribe(() => {
              this.newCompra = {
                provider: undefined,
                fecha: new Date().toISOString().split('T')[0]
              };

              const popup = document.getElementById('popup-agregar') as HTMLElement;
              if (popup && popup.hidePopover) popup.hidePopover();
            });
          }
        });
      });
    });
  }
}