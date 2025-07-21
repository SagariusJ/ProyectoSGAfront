import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPipe } from '../../pipes/filter.pipe';
import { LimitPipe } from '../../pipes/limit-pipe.pipe';
import { PaginatePipe } from '../../pipes/paginate.pipe';
import { FormsModule } from '@angular/forms';
import { VentaService, Venta } from '../../services/venta.service';
import { VentaDetailService, VentaDetail } from '../../services/venta-detail.service';
import { InformeService } from '../../services/informe.service';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterPipe, LimitPipe, PaginatePipe],
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {
  currentPage = 1;
  selectedLimit = 5;
  filterPost = '';

  ventas: Venta[] = [];
  ventaDetails: VentaDetail[] = [];

  newVenta: Venta = {
    user_id: 0,
    saleDate: new Date().toISOString().split('T')[0],
    cost: 0
  };

  newVentaDetail: VentaDetail = {
    sale: this.newVenta,
    producto_id: 0,
    amount: 0,
    price: 0
  };

  constructor(
    private ventaService: VentaService,
    private ventaDetailService: VentaDetailService,
    private informeService: InformeService // ✅ Inyectamos el servicio
  ) {}

  ngOnInit(): void {
    this.loadVentas();
    this.loadVentaDetails();
  }

  loadVentas(): void {
    this.ventaService.getAll().subscribe(data => {
      this.ventas = data;
    });
  }

  loadVentaDetails(): void {
    this.ventaDetailService.getAll().subscribe(data => {
      this.ventaDetails = data;
    });
  }

  get totalPages(): number {
    const filtered = this.ventas.filter(venta =>
      venta.id?.toString().includes(this.filterPost.toLowerCase()) ||
      venta.user_id.toString().includes(this.filterPost.toLowerCase())
    );
    return Math.ceil((filtered.length || 1) / this.selectedLimit);
  }

  get filteredVentas(): Venta[] {
    const filtered = this.ventas.filter(venta =>
      venta.id?.toString().includes(this.filterPost.toLowerCase()) ||
      venta.user_id.toString().includes(this.filterPost.toLowerCase())
    );
    return filtered.slice(
      (this.currentPage - 1) * this.selectedLimit,
      this.currentPage * this.selectedLimit
    );
  }

  addVenta(): void {
    if (this.newVenta.user_id && this.newVenta.saleDate) {
      this.ventaService.create(this.newVenta).subscribe({
        next: () => {
          this.loadVentas();
          const ventasOrdenadas = [...this.ventas].sort((a, b) => {
            return new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime();
          });
          const ventaCreada = ventasOrdenadas[0];
          if (ventaCreada && ventaCreada.id) {
            const nuevoDetalle: VentaDetail = {
              sale: ventaCreada,
              producto_id: 1,
              amount: 1,
              price: 0
            };
            this.ventaDetailService.create(nuevoDetalle).subscribe({
              next: () => {
                this.loadVentaDetails();
                this.newVenta = {
                  user_id: 0,
                  saleDate: new Date().toISOString().split('T')[0],
                  cost: 0
                };
                const popup = document.getElementById('popup-agregar-venta') as HTMLElement;
                if (popup && popup.hidePopover) popup.hidePopover();
              },
              error: (err) => {
                console.error('Error al crear el detalle:', err);
                alert('Venta creada, pero no se pudo crear el detalle automáticamente.');
                this.loadVentaDetails();
              }
            });
          } else {
            alert('No se pudo encontrar la venta recién creada.');
          }
        },
        error: (err) => {
          console.error('Error al crear la venta:', err);
          alert('No se pudo crear la venta.');
        }
      });
    } else {
      alert('El ID de usuario y la fecha son obligatorios.');
    }
  }

  addVentaDetail(): void {
    if (this.newVentaDetail.sale && this.newVentaDetail.producto_id && this.newVentaDetail.amount && this.newVentaDetail.price) {
      this.ventaDetailService.create(this.newVentaDetail).subscribe(() => {
        this.loadVentaDetails();
        this.newVentaDetail = {
          sale: this.newVenta,
          producto_id: 0,
          amount: 0,
          price: 0
        };
        const popup = document.getElementById('popup-agregar-detalle') as HTMLElement;
        if (popup && popup.hidePopover) popup.hidePopover();
      });
    } else {
      alert('Todos los campos del detalle son obligatorios.');
    }
  }

  ventaIdToDelete: number | null = null;
  detailIdToDelete: number | null = null;

  openDeleteVentaPopup(ventaId: number | undefined): void {
    if (ventaId != null) {
      this.ventaIdToDelete = ventaId;
      const popup = document.getElementById('popup-eliminar-venta') as HTMLElement;
      if (popup) popup.setAttribute('popover', 'auto');
    }
  }

  openDeleteDetailPopup(detailId: number | undefined): void {
    if (detailId != null) {
      this.detailIdToDelete = detailId;
      const popup = document.getElementById('popup-eliminar-detalle') as HTMLElement;
      if (popup) popup.setAttribute('popover', 'auto');
    }
  }

  deleteVenta(): void {
    if (this.ventaIdToDelete !== null) {
      this.ventaService.delete(this.ventaIdToDelete).subscribe(() => {
        this.loadVentas();
        this.loadVentaDetails();
        this.ventaIdToDelete = null;
        const popup = document.getElementById('popup-eliminar-venta') as HTMLElement;
        if (popup && popup.hidePopover) popup.hidePopover();
      });
    }
  }

  deleteDetail(): void {
    if (this.detailIdToDelete !== null) {
      this.ventaDetailService.delete(this.detailIdToDelete).subscribe(() => {
        this.loadVentaDetails();
        this.detailIdToDelete = null;
        const popup = document.getElementById('popup-eliminar-detalle') as HTMLElement;
        if (popup && popup.hidePopover) popup.hidePopover();
      });
    }
  }

  getDetailsForVenta(ventaId: number | undefined): VentaDetail[] {
    if (!ventaId) return [];
    return this.ventaDetails.filter(detail => detail.sale?.id === ventaId);
  }

  calculateTotal(venta: Venta): number {
    const details = this.getDetailsForVenta(venta.id);
    return details.reduce((total, detail) => total + (detail.price * detail.amount), 0);
  }

  // ✅ NUEVO: Método para descargar el informe
  downloadReport(): void {
    this.informeService.downloadDailyReport().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'informe_diario.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Error al descargar el informe:', error);
      alert('No se pudo descargar el informe.');
    });
  }
}