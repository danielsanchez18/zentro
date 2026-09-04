import { create } from "zustand";
import { inventoryItems as initialItems, type InventoryItem } from "@/lib/mock/inventory";
import { inventoryMovements as initialMovements, type InventoryMovementRecord, type InventoryMovementType } from "@/lib/mock/inventory-movements";
import { inventorySuppliers as initialSuppliers, type InventorySupplier } from "@/lib/mock/inventory-suppliers";
import { inventoryBrands as initialBrands, type InventoryBrand } from "@/lib/mock/inventory-brands";

interface NewMovement {
  id: string;
  itemId: string;
  type: InventoryMovementType;
  quantity: number;
  resultingStock: number;
  createdAt: string;
  reason?: string;
  notes?: string;
  documentRef?: string;
  previousStock?: number;
}

interface InventoryStore {
  items: InventoryItem[];
  movements: InventoryMovementRecord[];
  suppliers: InventorySupplier[];
  brands: InventoryBrand[];
  updateItem: (itemId: string, changes: Partial<InventoryItem>) => void;
  addMovement: (movement: NewMovement) => void;
  addSupplier: (supplier: InventorySupplier) => void;
  updateSupplier: (supplierId: string, changes: Partial<InventorySupplier>) => void;
  removeSupplier: (supplierId: string) => void;
  addBrand: (brand: InventoryBrand) => void;
  updateBrand: (brandId: string, changes: Partial<InventoryBrand>) => void;
  removeBrand: (brandId: string) => void;
}

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  items: initialItems,
  movements: initialMovements,
  suppliers: initialSuppliers,
  brands: initialBrands,
  updateItem: (itemId, changes) => set((state) => ({
    items: state.items.map((item) => item.id === itemId ? { ...item, ...changes } : item),
  })),
  addMovement: (movement) => {
    const item = get().items.find((candidate) => candidate.id === movement.itemId);
    if (!item) return;
    const record: InventoryMovementRecord = {
      ...movement,
      productName: item.productName,
      sku: item.sku,
      previousStock: movement.previousStock ?? item.currentStock,
      reason: movement.reason ?? "Movimiento de inventario",
      responsible: "Usuario actual",
    };
    set((state) => ({ movements: [record, ...state.movements] }));
  },
  addSupplier: (supplier) => set((state) => ({
    suppliers: [supplier, ...state.suppliers],
  })),
  updateSupplier: (supplierId, changes) => set((state) => ({
    suppliers: state.suppliers.map((supplier) => supplier.id === supplierId ? { ...supplier, ...changes } : supplier),
  })),
  removeSupplier: (supplierId) => set((state) => ({
    suppliers: state.suppliers.filter((supplier) => supplier.id !== supplierId),
  })),
  addBrand: (brand) => set((state) => ({
    brands: [brand, ...state.brands],
  })),
  updateBrand: (brandId, changes) => set((state) => ({
    brands: state.brands.map((brand) => brand.id === brandId ? { ...brand, ...changes } : brand),
  })),
  removeBrand: (brandId) => set((state) => ({
    brands: state.brands.filter((brand) => brand.id !== brandId),
  })),
}));
