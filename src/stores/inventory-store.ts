import { create } from "zustand";
import { inventoryItems as initialItems, type InventoryItem } from "@/lib/mock/inventory";
import { inventoryMovements as initialMovements, type InventoryMovementRecord, type InventoryMovementType } from "@/lib/mock/inventory-movements";

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
  updateItem: (itemId: string, changes: Partial<InventoryItem>) => void;
  addMovement: (movement: NewMovement) => void;
}

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  items: initialItems,
  movements: initialMovements,
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
}));

