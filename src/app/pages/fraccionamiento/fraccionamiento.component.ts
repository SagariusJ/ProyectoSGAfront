import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SucursalService, Warehouse } from '../../services/sucursal.service';
import { MedicamentoService, Products } from '../../services/medicamento.service';
import { FraccionamientoService } from '../../services/fraccionamiento.service';
import { NotificacionService } from '../../services/notificaciones.service';

@Component({
  selector: 'app-fraccionamiento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fraccionamiento.component.html',
  styleUrls: ['./fraccionamiento.component.css']
})
export class FraccionamientoComponent implements OnInit {
  sucursales: Warehouse[] = [];
  productos: Products[] = [];
  sucursalesDestinatario: Warehouse[] = [];
  
  // Valores seleccionados
  emisorSeleccionado: number | null = null;
  destinatarioSeleccionado: number | null = null;
  productoSeleccionado: number | null = null;
  cantidad: number = 0;

  // Estado de carga
  cargando = false;
  mensaje: {texto: string, tipo: string} | null = null;

  constructor(
    private sucursalService: SucursalService,
    private medicamentoService: MedicamentoService,
    private fraccionamientoService: FraccionamientoService,
    private notificacionService: NotificacionService
  ) {}

  ngOnInit(): void {
    this.cargarSucursales();
    this.cargarProductos();
    
    // Suscribirse a notificaciones
    this.notificacionService.mensajeActual.subscribe(mensaje => {
      this.mensaje = mensaje;
    });
  }

  cargarSucursales(): void {
    this.cargando = true;
    this.sucursalService.getAll().subscribe({
      next: (data) => {
        this.sucursales = data;
        this.sucursalesDestinatario = [...data];
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar sucursales', error);
        this.notificacionService.mostrarMensaje('Error al cargar sucursales', 'error');
        this.cargando = false;
      }
    });
  }

  cargarProductos(): void {
    this.cargando = true;
    this.medicamentoService.getAll().subscribe({
      next: (data) => {
        this.productos = data;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar productos', error);
        this.notificacionService.mostrarMensaje('Error al cargar productos', 'error');
        this.cargando = false;
      }
    });
  }

  onEmisorChange(): void {
    if (this.emisorSeleccionado) {
      this.sucursalesDestinatario = this.sucursales.filter(
        sucursal => sucursal.id !== this.emisorSeleccionado
      );
      
      if (this.destinatarioSeleccionado === this.emisorSeleccionado) {
        this.destinatarioSeleccionado = null;
      }
    } else {
      this.sucursalesDestinatario = [...this.sucursales];
    }
  }

  enviar(): void {
    if (!this.emisorSeleccionado || !this.destinatarioSeleccionado || !this.productoSeleccionado || this.cantidad <= 0) {
      this.notificacionService.mostrarMensaje('Todos los campos son obligatorios y la cantidad debe ser mayor a 0', 'error');
      return;
    }

    const datosTransferencia = {
      origen_id: this.emisorSeleccionado,
      destino_id: this.destinatarioSeleccionado,
      producto_id: this.productoSeleccionado,
      cantidad: this.cantidad,
      fecha: new Date().toISOString()
    };

    this.cargando = true;
    this.fraccionamientoService.realizarTransferencia(datosTransferencia).subscribe({
      next: () => {
        this.notificacionService.mostrarMensaje('Transferencia realizada con éxito', 'exito');
        this.resetFormulario();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al realizar transferencia', error);
        this.notificacionService.mostrarMensaje('Error al realizar transferencia', 'error');
        this.cargando = false;
      }
    });
  }

  resetFormulario(): void {
    this.emisorSeleccionado = null;
    this.destinatarioSeleccionado = null;
    this.productoSeleccionado = null;
    this.cantidad = 0;
    this.sucursalesDestinatario = [...this.sucursales];
  }
}