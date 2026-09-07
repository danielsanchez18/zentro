import { create } from "zustand";
import {
  orders as initialOrders,
  type CustomerOrder,
  type Courier,
  type CourierStatus,
  type OrderPayment,
  type OrderStatus,
} from "@/lib/mock/orders";

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
  registerPayment: (id: string, payment: Omit<OrderPayment, "id" | "createdAt">) => boolean;
  assignCourier: (id: string, courier: Courier) => boolean;
  updateCourierStatus: (id: string, status: CourierStatus) => boolean;
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
  registerPayment: (id, payment) => {
    let changed = false;
    set((state) => ({
      orders: state.orders.map((order) => {
        if (order.id !== id || payment.amount <= 0 || order.paymentStatus === "reembolsado") return order;
        const legacyPaid = order.paymentStatus === "pagado" ? order.total : order.paymentStatus === "pago_parcial" ? order.total / 2 : 0;
        const previousPaid = order.payments?.reduce((sum, item) => sum + item.amount, 0) ?? legacyPaid;
        const paid = Math.min(order.total, previousPaid + payment.amount);
        const now = new Date().toISOString();
        changed = true;
        return {
          ...order,
          payments: [...(order.payments ?? []), { ...payment, id: `pay_${Date.now()}`, createdAt: now }],
          paymentStatus: paid >= order.total ? "pagado" : "pago_parcial",
          paymentMethod: payment.method,
          paymentReference: payment.reference || order.paymentReference,
          updatedAt: now,
        };
      }),
    }));
    return changed;
  },
  assignCourier: (id, courier) => {
    let changed = false;
    set((state) => ({
      orders: state.orders.map((order) => {
        if (order.id !== id || order.serviceType !== "delivery" || ["entregado", "cancelado"].includes(order.status)) return order;
        changed = true;
        return {
          ...order,
          courier: { ...courier, progress: 0, etaMinutes: courier.etaMinutes || 25, status: "asignado" },
          updatedAt: new Date().toISOString(),
        };
      }),
    }));
    return changed;
  },
  updateCourierStatus: (id, status) => {
    let changed = false;
    set((state) => ({
      orders: state.orders.map((order) => {
        if (order.id !== id || !order.courier || order.status === "cancelado") return order;
        const deliveryState = {
          asignado: { progress: 10, etaMinutes: 25 },
          recogido: { progress: 35, etaMinutes: 20 },
          en_camino: { progress: 65, etaMinutes: 12 },
          entregado: { progress: 100, etaMinutes: 0 },
        }[status];
        changed = true;
        return {
          ...order,
          courier: { ...order.courier, ...deliveryState, status },
          status: status === "entregado" ? "entregado" : order.status,
          updatedAt: new Date().toISOString(),
        };
      }),
    }));
    return changed;
  },
}));
