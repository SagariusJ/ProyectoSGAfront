import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SucursalService, Warehouse } from '../../services/sucursal.service';
import { MedicamentoService, Products } from '../../services/medicamento.service';
import {
  FraccionamientoService,
  Fraccionamiento
} from '../../services/fraccionamiento.service';
import { NotificacionService } from '../../services/notificaciones.service';
import { AuthService } from '../../services/auth.service';  // <<— Import

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

  emisorSeleccionado: number | null = null;
  destinatarioSeleccionado: number | null = null;
  productoSeleccionado: number | null = null;
  cantidad: number = 0;
  usuarioId: number = 0;

  cargando = false;
  mensaje: { texto: string; tipo: string } | null = null;

  constructor(
    private sucursalService: SucursalService,
    private medicamentoService: MedicamentoService,
    private fraccionamientoService: FraccionamientoService,
    private notificacionService: NotificacionService,
    private authService: AuthService              // <<— Inject
  ) {}

  ngOnInit(): void {
    // 1. Verificar login
    if (!this.authService.isLoggedIn()) {
      this.notificacionService.mostrarMensaje(
        'Debe iniciar sesión para fraccionar productos',
        'error'
      );
      return;
    }

    // 2. Extraer usuarioId desde el token JWT
    this.usuarioId = this.extractUserIdFromToken() || 0;

    // 3. Cargar datos iniciales
    this.cargarSucursales();
    this.cargarProductos();

    this.notificacionService.mensajeActual.subscribe(
      m => (this.mensaje = m)
    );
  }

  private extractUserIdFromToken(): number | null {
    const token = this.authService.getToken();
    if (!token) {
      return null;
    }
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.userId ?? decoded.usuarioId ?? null;
    } catch {
      console.warn('Token inválido, no se pudo extraer usuarioId');
      return null;
    }
  }

  cargarSucursales(): void {
    this.cargando = true;
    this.sucursalService.getAll().subscribe({
      next: data => {
        this.sucursales = data;
        this.sucursalesDestinatario = [...data];
        this.cargando = false;
      },
      error: err => {
        console.error('Error al cargar sucursales', err);
        this.notificacionService.mostrarMensaje(
          'Error al cargar sucursales',
          'error'
        );
        this.cargando = false;
      }
    });
  }

  cargarProductos(): void {
    this.cargando = true;
    this.medicamentoService.getAll().subscribe({
      next: data => {
        this.productos = data;
        this.cargando = false;
      },
      error: err => {
        console.error('Error al cargar productos', err);
        this.notificacionService.mostrarMensaje(
          'Error al cargar productos',
          'error'
        );
        this.cargando = false;
      }
    });
  }

  onEmisorChange(): void {
    if (this.emisorSeleccionado) {
      this.sucursalesDestinatario = this.sucursales.filter(
        s => s.id !== this.emisorSeleccionado
      );
      if (this.destinatarioSeleccionado === this.emisorSeleccionado) {
        this.destinatarioSeleccionado = null;
      }
    } else {
      this.sucursalesDestinatario = [...this.sucursales];
    }
  }

  enviar(): void {
    if (
      !this.emisorSeleccionado ||
      !this.destinatarioSeleccionado ||
      !this.productoSeleccionado ||
      this.cantidad <= 0
    ) {
      this.notificacionService.mostrarMensaje(
        'Todos los campos son obligatorios y la cantidad debe ser mayor a 0',
        'error'
      );
      return;
    }

    const datos: Fraccionamiento = {
      productoId: this.productoSeleccionado,
      cantidad: this.cantidad,
      sucursalOrigenId: this.emisorSeleccionado,
      sucursalDestinoId: this.destinatarioSeleccionado,
      fecha: new Date().toISOString(),
      usuarioId: this.usuarioId
    };

    this.cargando = true;
    this.fraccionamientoService.create(datos).subscribe({
      next: () => {
        this.notificacionService.mostrarMensaje(
          'Transferencia realizada con éxito',
          'exito'
        );
        this.resetFormulario();
        this.cargando = false;
      },
      error: err => {
        console.error('Error al realizar transferencia', err);
        this.notificacionService.mostrarMensaje(
          'Error al realizar transferencia',
          'error'
        );
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
