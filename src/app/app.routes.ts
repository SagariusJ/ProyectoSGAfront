import { Routes } from '@angular/router';
import { GestionInventarioComponent } from './pages/gestion-inventario/gestion-inventario.component';
import { GestionProductoComponent } from './pages/gestion-producto/gestion-producto.component';
import { GestionBodegaComponent } from './pages/gestion-bodega/gestion-bodega.component';
import { ListaUsuariosComponent } from './pages/lista-usuarios/lista-usuarios.component';
import { HomeComponent } from './pages/home/home.component';
import { ComprasComponent } from './pages/compras/compras.component';
import { LoginComponent } from './pages/login/login.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { RegisterComponent } from './pages/register/register.component';
import { Component } from '@angular/core';
import { BeneficiosComponent } from './pages/beneficios/beneficios.component';
import { FraccionamientoComponent } from './pages/fraccionamiento/fraccionamiento.component';
import { DispersionComponent } from './pages/dispersion/dispersion.component';
import { VentasComponent } from './pages/ventas/ventas.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent},
    { path: 'inventario', component: GestionInventarioComponent },
    { path: 'productos', component: GestionProductoComponent},
    { path: 'bodega', component: GestionBodegaComponent},
    { path: 'userlist', component: ListaUsuariosComponent},
    { path: 'checkout', component: ComprasComponent},
    { path: 'user', component: UsuarioComponent},
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
    { path: 'beneficios', component: BeneficiosComponent},
    { path: 'fraccionamiento', component: FraccionamientoComponent},
    { path: 'dispersion', component: DispersionComponent },
    { path: 'ventas', component: VentasComponent }
];
