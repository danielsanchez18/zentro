import { create } from "zustand";
import { purchaseOrders as initialOrders, type PurchaseOrder, type PurchaseStatus } from "@/lib/mock/purchases";

interface PurchasesStore {
  orders: PurchaseOrder[];
  addOrder: (order: PurchaseOrder) => void;
  updateOrder: (id: string, changes: Partial<PurchaseOrder>) => void;
  removeOrder: (id: string) => void;
  setStatus: (id: string, status: PurchaseStatus) => void;
  receive: (id: string, quantities: Record<string, number>) => void;
}

export const usePurchasesStore = create<PurchasesStore>((set) => ({
  orders: initialOrders,
  addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
  updateOrder: (id, changes) => set((state) => ({ orders: state.orders.map((order) => order.id === id ? { ...order, ...changes } : order) })),
  removeOrder: (id) => set((state) => ({ orders: state.orders.filter((order) => order.id !== id) })),
  setStatus: (id, status) => set((state) => ({ orders: state.orders.map((order) => order.id === id ? { ...order, status } : order) })),
  receive: (id, quantities) => set((state) => ({ orders: state.orders.map((order) => {
    if (order.id !== id) return order;
    const lines = order.lines.map((line) => ({ ...line, receivedQuantity: Math.min(line.quantity, line.receivedQuantity + (quantities[line.id] ?? 0)) }));
    const receivedUnits = lines.reduce((sum, line) => sum + line.receivedQuantity, 0);
    return { ...order, lines, receivedUnits, status: receivedUnits >= order.orderedUnits ? "recibida" : "parcial" };
  }) })),
}));
