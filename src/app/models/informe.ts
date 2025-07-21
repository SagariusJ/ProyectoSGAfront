export interface CompraDTO {
  id: number;
  proveedor: string;
  monto: number;
  fecha: string; // Formato ISO: "YYYY-MM-DD"
}

export interface VentaDTO {
  id: number;
  cliente: string;
  monto: number;
  fecha: string; // Formato ISO: "YYYY-MM-DD"
}

export interface Informe {
  totalCompras: number;
  montoCompras: number;
  totalVentas: number;
  montoVentas: number;
  balance: number;
  fechaInforme: string; // LocalDate en Spring se convierte a string en formato ISO
  compras: CompraDTO[];
  ventas: VentaDTO[];
}