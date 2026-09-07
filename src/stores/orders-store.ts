import { create } from "zustand";
import { orders as initialOrders, type CustomerOrder, type OrderStatus } from "@/lib/mock/orders";

const transitions: Record<OrderStatus, OrderStatus[]> = {
  nuevo: ["confirmado", "cancelado"],
  confirmado: ["en_preparacion", "cancelado"],
  en_preparacion: ["listo", "cancelado"],
  listo: ["entregado", "cancelado"],
  entregado: [],
  cancelado: [],
};

interface OrdersStore {
  orders: CustomerOrder[];
  transitionOrder: (id: string, status: OrderStatus) => boolean;
}

export const canTransitionOrder = (current: OrderStatus, next: OrderStatus) => transitions[current].includes(next);

export const useOrdersStore = create<OrdersStore>((set) => ({
  orders: initialOrders,
  transitionOrder: (id, status) => {
    let changed = false;
    set((state) => ({ orders: state.orders.map((order) => {
      if (order.id !== id || !canTransitionOrder(order.status, status)) return order;
      changed = true;
      return { ...order, status, updatedAt: new Date().toISOString() };
    }) }));
    return changed;
  },
}));
