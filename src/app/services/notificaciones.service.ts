import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  private mensaje = new BehaviorSubject<{texto: string, tipo: 'exito' | 'error'} | null>(null);
  mensajeActual = this.mensaje.asObservable();

  mostrarMensaje(texto: string, tipo: 'exito' | 'error') {
    this.mensaje.next({texto, tipo});
    setTimeout(() => this.mensaje.next(null), 5000);
  }
}