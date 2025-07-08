import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { GestionInventarioComponent } from "./pages/gestion-inventario/gestion-inventario.component";
import { GestionProductoComponent } from './pages/gestion-producto/gestion-producto.component';
import { GestionBodegaComponent } from './pages/gestion-bodega/gestion-bodega.component';
import { HomeComponent } from './pages/home/home.component';
import { ComprasComponent } from './pages/compras/compras.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    GestionInventarioComponent,
    GestionProductoComponent,
    GestionBodegaComponent,
    HomeComponent,
    ComprasComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'inventario-frontend';

  constructor(private authService: AuthService, private router: Router) {}

  openMenu(): void {
    const overlay = document.getElementById('side-menu-overlay');
    if (overlay) {
      overlay.classList.remove('hidden');
    }
  }

  closeMenu(): void {
    const overlay = document.getElementById('side-menu-overlay');
    if (overlay) {
      overlay.classList.add('hidden');
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
    window.location.reload(); // fuerza refresco del estado
  }
}