import { Component } from '@angular/core';
import { SliceProductsPipe } from '../../pipes/slice-products.pipe';

export interface Producto {
  imagen: string;
  titulo: string;
  descripcion: string;
  precio: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SliceProductsPipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  productos: Producto[] = [
    { imagen: 'producto1.jpg', titulo: 'Nombre del Producto1', descripcion: 'Descripción breve del producto.', precio: 8990 },
    { imagen: 'producto2.jpg', titulo: 'Nombre del Producto2', descripcion: 'Descripción breve del producto.', precio: 4990 },
    { imagen: 'producto3.jpg', titulo: 'Nombre del Producto3', descripcion: 'Descripción breve del producto.', precio: 5990 },
    { imagen: 'producto4.jpg', titulo: 'Nombre del Producto4', descripcion: 'Descripción breve del producto.', precio: 6990 },
    { imagen: 'producto5.jpg', titulo: 'Nombre del Producto5', descripcion: 'Descripción breve del producto.', precio: 8990 },
    { imagen: 'producto6.jpg', titulo: 'Nombre del Producto6', descripcion: 'Descripción breve del producto.', precio: 9990 }
  ];

  startIndex: number = 0;

  mostrarPrev(): void {
    if (this.startIndex > 0) {
      this.startIndex--;
    }
  }

  mostrarNext(): void {
    if (this.startIndex < this.productos.length - 4) {
      this.startIndex++;
    }
  }

  // Carrusel superior de imágenes
  slides = [
    'slide1.jpg',
    'slide2.jpg',
    'slide3.jpg',
    'slide4.jpg',
    'slide5.jpg',
    'slide6.jpg'
  ];
  currentIndex = 0;

  get carouselTransform(): string {
    return `translateX(-${this.currentIndex * 100}vw)`;
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
  }
}
