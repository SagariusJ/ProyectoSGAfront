import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../../pipes/filter.pipe';
import { LimitPipe } from '../../pipes/limit-pipe.pipe';
import { PaginatePipe } from '../../pipes/paginate.pipe';

import { InventarioService, Inventory } from '../../services/inventario.service';
import { MedicamentoService, Products } from '../../services/medicamento.service';
import { SucursalService, Warehouse } from '../../services/sucursal.service';
import { SucursalInventarioService, StockWare } from '../../services/sucursal-inventario.service';

@Component({
  selector: 'app-gestion-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterPipe, LimitPipe, PaginatePipe],
  templateUrl: './gestion-inventario.component.html',
  styleUrl: './gestion-inventario.component.css'
})
export class GestionInventarioComponent implements OnInit {
  currentPage = 1;
  selectedLimit = 5;
  filterPost = "";

  posts: StockWare[] = [];

  productsList: Products[] = [];
  warehouseList: Warehouse[] = [];

  stockwareiD: number | undefined = 0;

  newInventory: {
    selectedProductId: number | null;
    selectedWarehouseId: number | null;
    inventory_number: number;
    exp_date: string;
    unit_price: number;
    stockAmount: number;
  } = {
    selectedProductId: null,
    selectedWarehouseId: null,
    inventory_number: 0,
    exp_date: '',
    unit_price: 0,
    stockAmount: 0
  };

  editInventory: {
    selectedProductId: number | null;
    selectedWarehouseId: number | null;
    id: number | undefined,
    inventory_number: number;
    exp_date: string;
    unit_price: number;
    stockAmount: number;
  } = {
    selectedProductId: null,
    selectedWarehouseId: null,
    id: 0,
    inventory_number: 0,
    exp_date: '',
    unit_price: 0,
    stockAmount: 0
  };

  constructor(
    private inventarioService: InventarioService,
    private medicamentoService: MedicamentoService,
    private sucursalService: SucursalService,
    private sucursalInventarioService: SucursalInventarioService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadWarehouses();
    this.loadStock();
  }

  loadProducts(): void {
    this.medicamentoService.getAll().subscribe(data => this.productsList = data);
  }

  loadWarehouses(): void {
    this.sucursalService.getAll().subscribe(data => this.warehouseList = data);
  }

  loadStock(): void {
    this.sucursalInventarioService.getAll().subscribe(data => this.posts = data);
  }

  get totalPages(): number {
    const filtered = this.filteredPosts;
    return Math.ceil((filtered.length || 1) / this.selectedLimit);
  }

  get filteredPosts(): StockWare[] {
    return this.posts.filter(post =>
      post.lot?.product?.product_name?.toLowerCase().includes(this.filterPost.toLowerCase())
    ).slice(
      (this.currentPage - 1) * this.selectedLimit,
      this.currentPage * this.selectedLimit
    );
  }

  addInventory(): void {
    const {
      selectedProductId,
      selectedWarehouseId,
      inventory_number,
      exp_date,
      unit_price,
      stockAmount,
    } = this.newInventory;

    if (!selectedProductId || !selectedWarehouseId) {
      alert('Debes seleccionar un producto y una bodega.');
      return;
    }

    const selectedProduct = this.productsList.find(p => p.id === selectedProductId);
    const selectedWarehouse = this.warehouseList.find(w => w.id === selectedWarehouseId);

    if (!selectedProduct || !selectedWarehouse) {
      alert('Producto o bodega seleccionados no válidos.');
      return;
    }

    const newInv: Inventory = {
      product: selectedProduct,
      inventory_number,
      exp_date,
      unit_price
    };

    this.inventarioService.create(newInv).subscribe(() => {
    // Luego de crear, obtener todos los inventarios y buscar el creado
      this.inventarioService.getAll().subscribe((allInventories: Inventory[]) => {
        const matchedInventory = allInventories.find(inv =>
          inv.product.id === selectedProduct.id &&
          inv.inventory_number === inventory_number &&
          inv.exp_date === exp_date &&
          inv.unit_price === unit_price
        );

        if (!matchedInventory) {
          alert('No se pudo encontrar el inventario recién creado.');
          return;
        }

        const stock: StockWare = {
          lot: matchedInventory,
          warehouse: selectedWarehouse,
          amount: stockAmount
        };

        this.sucursalInventarioService.create(stock).subscribe(() => {
          this.loadStock();
          this.resetForm();

          const popup = document.getElementById('popup-agregar') as HTMLElement;
          if (popup && popup.hidePopover) popup.hidePopover();
        });
      });
    });
  }

  openEditPopup(stockware: StockWare): void {
    this.editInventory = {
      selectedProductId: stockware.lot.product?.id ?? null,
      selectedWarehouseId: stockware.warehouse?.id ?? null,
      inventory_number: stockware.lot.inventory_number,
      id: stockware.lot.id,
      exp_date: stockware.lot.exp_date,
      unit_price: stockware.lot.unit_price,
      stockAmount: stockware.amount ?? 0
    };

    this.stockwareiD = stockware.id;

    const popup = document.getElementById('popup-modificar') as HTMLElement;
    if (popup) popup.setAttribute('popover', 'auto');
  }

  updateInventory(): void {
    const {
      selectedProductId,
      selectedWarehouseId,
      inventory_number,
      exp_date,
      unit_price,
      stockAmount,
      id
    } = this.editInventory;

    if (!selectedProductId || !selectedWarehouseId || id == null) {
      alert('Todos los campos son obligatorios para modificar.');
      return;
    }

    const selectedProduct = this.productsList.find(p => p.id === selectedProductId);
    const selectedWarehouse = this.warehouseList.find(w => w.id === selectedWarehouseId);

    if (!selectedProduct || !selectedWarehouse) {
      alert('Producto o bodega no válidos.');
      return;
    }

    const updatedInventory: Inventory = {
      product: selectedProduct,
      inventory_number,
      exp_date,
      unit_price
    };

    this.inventarioService.update(id, updatedInventory).subscribe(() => {
      this.inventarioService.getAll().subscribe((inventories: Inventory[]) => {
        const matched = inventories.find(i =>
          i.product.id === selectedProductId &&
          i.inventory_number === inventory_number &&
          i.exp_date === exp_date &&
          i.unit_price === unit_price
        );

        if (!matched) {
          alert('No se encontró el inventario actualizado.');
          return;
        }

        const updatedStock: StockWare = {
          lot: matched,
          warehouse: selectedWarehouse,
          amount: stockAmount,
          id: this.stockwareiD
        };

        this.sucursalInventarioService.update(updatedStock.id!, updatedStock).subscribe(() => {
          this.loadStock();
          const popup = document.getElementById('popup-modificar') as HTMLElement;
          if (popup && popup.hidePopover) popup.hidePopover();
        });
      });
    });
  }


  stockwareIdToDelete: number | null = null;
  inventoryIdToDelete: number | null = null;

  openDeletePopup(stockwareId: number|undefined, inventoryId: number|undefined): void{
    if(stockwareId!=null && inventoryId!=null){
      this.stockwareIdToDelete = stockwareId;
      this.inventoryIdToDelete = inventoryId;
      const popup = document.getElementById('popup-eliminar') as HTMLElement;
      if (popup) popup.setAttribute('popover', 'auto');
    }
  }

  deleteInventory(): void {
    if (this.stockwareIdToDelete !== null && this.inventoryIdToDelete !== null) {
      this.sucursalInventarioService.delete(this.stockwareIdToDelete).subscribe(() => {
        this.inventarioService.delete(this.inventoryIdToDelete!).subscribe(() => {
          this.loadStock();
          this.stockwareIdToDelete = null;
          this.inventoryIdToDelete = null;

          const popup = document.getElementById('popup-eliminar') as HTMLElement;
          if (popup && popup.hidePopover) popup.hidePopover();
        }, error => {
          alert('Error al eliminar el inventario.');
        });
      }, error => {
        alert('Error al eliminar el stockware.');
      });
    }
  }


  resetForm(): void {
    this.newInventory = {
      selectedProductId: null,
      selectedWarehouseId: null,
      inventory_number: 0,
      exp_date: '',
      unit_price: 0,
      stockAmount: 0
    };
  }
}