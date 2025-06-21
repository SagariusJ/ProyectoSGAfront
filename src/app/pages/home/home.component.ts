import { Component } from '@angular/core';
import { SliceProductsPipe } from '../../pipes/slice-products.pipe';
import { NgForOf } from '@angular/common';
import { SlicePipe } from '@angular/common';
export interface Producto {
  imagen: string;
  titulo: string;
  descripcion: string;
  precio: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SliceProductsPipe, NgForOf, SlicePipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  slidesArriba = [
    { imagen: 'Producto1.jpg', alt: 'Slide 1' },
    { imagen: 'Producto2.jpg', alt: 'Slide 2' },
    { imagen: 'Producto3.jpg', alt: 'Slide 3' },
    { imagen: 'Producto4.jpg', alt: 'Slide 4' },
    { imagen: 'Producto5.jpg', alt: 'Slide 5' },
    { imagen: 'Producto6.jpg', alt: 'Slide 6' },
  ];

  productos: Producto[] = [
    { imagen: 'Producto1.jpg', titulo: 'Nombre del Producto1', descripcion: 'Descripción breve del producto.', precio: 8990 },
    { imagen: 'Producto2.jpg', titulo: 'Nombre del Producto2', descripcion: 'Descripción breve del producto.', precio: 4990 },
    { imagen: 'Producto3.jpg', titulo: 'Nombre del Producto3', descripcion: 'Descripción breve del producto.', precio: 5990 },
    { imagen: 'Producto4.jpg', titulo: 'Nombre del Producto4', descripcion: 'Descripción breve del producto.', precio: 6990 },
    { imagen: 'Producto5.jpg', titulo: 'Nombre del Producto5', descripcion: 'Descripción breve del producto.', precio: 8990 },
    { imagen: 'Producto6.jpg', titulo: 'Nombre del Producto6', descripcion: 'Descripción breve del producto.', precio: 9990 }
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

  // Para el carrusel principal de imágenes (slides)
  slides = Array(6);  // tamaño fijo 6 (puedes cambiar según número de slides)
  currentIndex = 0;

  get carouselTransform(): string {
    return `translateX(-${this.currentIndex * 90}vw)`;
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
