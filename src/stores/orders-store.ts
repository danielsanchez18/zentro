import { create } from "zustand";
import {
  orders as initialOrders,
  type CustomerOrder,
  type Courier,
  type CourierStatus,
  type OrderPayment,
  type OrderLine,
  type OrderReceipt,
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
  addOrder: (order: CustomerOrder) => void;
  transitionOrder: (id: string, status: OrderStatus) => boolean;
  registerPayment: (id: string, payment: Omit<OrderPayment, "id" | "createdAt">) => boolean;
  assignCourier: (id: string, courier: Courier) => boolean;
  updateCourierStatus: (id: string, status: CourierStatus) => boolean;
  cancelOrder: (id: string, reason: string, note?: string) => boolean;
  refundPayment: (id: string, amount: number, reason: string) => boolean;
  issueReceipt: (id: string, receipt: Omit<OrderReceipt, "number" | "issuedAt">) => boolean;
  updateOrderContent: (id: string, lines: OrderLine[], manualDiscount: number, reason: string) => boolean;
}

export const canTransitionOrder = (current: OrderStatus, next: OrderStatus) => transitions[current].includes(next);

export const useOrdersStore = create<OrdersStore>((set) => ({
  orders: initialOrders,
  addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
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
        const previousPaid = order.paidAmount ?? order.payments?.reduce((sum, item) => sum + item.amount, 0) ?? legacyPaid;
        const paid = Math.min(order.total, previousPaid + payment.amount);
        const now = new Date().toISOString();
        changed = true;
        return {
          ...order,
          payments: [...(order.payments ?? []), { ...payment, id: `pay_${Date.now()}`, createdAt: now }],
          paymentStatus: paid >= order.total ? "pagado" : "pago_parcial",
          paymentMethod: payment.method,
          paymentReference: payment.reference || order.paymentReference,
          paidAmount: paid,
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
  cancelOrder: (id, reason, note) => {
    let changed = false;
    set((state) => ({
      orders: state.orders.map((order) => {
        if (order.id !== id || !canTransitionOrder(order.status, "cancelado") || !reason.trim()) return order;
        const now = new Date().toISOString();
        changed = true;
        return { ...order, status: "cancelado", cancellation: { reason: reason.trim(), note: note?.trim() || undefined, createdAt: now }, updatedAt: now };
      }),
    }));
    return changed;
  },
  refundPayment: (id, amount, reason) => {
    let changed = false;
    set((state) => ({
      orders: state.orders.map((order) => {
        const legacyPaid = order.paymentStatus === "pagado" || order.paymentStatus === "reembolsado" ? order.total : order.paymentStatus === "pago_parcial" ? order.total / 2 : 0;
        const paid = order.paidAmount ?? order.payments?.reduce((sum, payment) => sum + payment.amount, 0) ?? legacyPaid;
        const refunded = order.refunds?.reduce((sum, refund) => sum + refund.amount, 0) ?? (order.paymentStatus === "reembolsado" ? paid : 0);
        const refundable = Math.max(0, paid - refunded);
        if (order.id !== id || amount <= 0 || amount > refundable || !reason.trim()) return order;
        const now = new Date().toISOString();
        const totalRefunded = refunded + amount;
        changed = true;
        return {
          ...order,
          refunds: [...(order.refunds ?? []), { id: `refund_${Date.now()}`, amount, reason: reason.trim(), createdAt: now }],
          paymentStatus: totalRefunded >= paid ? "reembolsado" : order.paymentStatus,
          updatedAt: now,
        };
      }),
    }));
    return changed;
  },
  issueReceipt: (id, receipt) => {
    let changed = false;
    set((state) => ({
      orders: state.orders.map((order) => {
        if (order.id !== id || order.receipt || order.paymentStatus === "pago_pendiente") return order;
        const now = new Date().toISOString();
        changed = true;
        return { ...order, receipt: { ...receipt, number: `${receipt.type === "factura" ? "F001" : "B001"}-${String(Date.now()).slice(-6)}`, issuedAt: now }, updatedAt: now };
      }),
    }));
    return changed;
  },
  updateOrderContent: (id, lines, manualDiscount, reason) => {
    let changed = false;
    set((state) => ({
      orders: state.orders.map((order) => {
        if (order.id !== id || !["nuevo", "confirmado", "en_preparacion"].includes(order.status) || lines.length === 0 || !reason.trim()) return order;
        const normalizedLines = lines.map((line) => ({ ...line, quantity: Math.max(1, line.quantity), total: Math.max(1, line.quantity) * line.unitPrice - line.discount }));
        const subtotal = normalizedLines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
        const promotionDiscount = Math.max(0, order.discount - (order.manualDiscount ?? 0));
        const safeManualDiscount = Math.min(Math.max(0, manualDiscount), Math.max(0, subtotal - promotionDiscount));
        const discount = promotionDiscount + safeManualDiscount;
        const total = Math.max(0, subtotal - discount + order.deliveryFee);
        const now = new Date().toISOString();
        const removed = order.lines.filter((before) => !normalizedLines.some((after) => after.id === before.id)).length;
        const added = normalizedLines.filter((after) => !order.lines.some((before) => before.id === after.id)).length;
        const quantities = normalizedLines.filter((after) => order.lines.some((before) => before.id === after.id && before.quantity !== after.quantity)).length;
        const replacements = normalizedLines.filter((after) => order.lines.some((before) => before.id === after.id && before.productId !== after.productId)).length;
        const discountChanged = safeManualDiscount !== (order.manualDiscount ?? 0);
        const summary = [added && `${added} agregado${added === 1 ? "" : "s"}`, removed && `${removed} retirado${removed === 1 ? "" : "s"}`, replacements && `${replacements} reemplazado${replacements === 1 ? "" : "s"}`, quantities && `${quantities} cantidad${quantities === 1 ? "" : "es"} modificada${quantities === 1 ? "" : "s"}`, discountChanged && "descuento manual actualizado"].filter(Boolean).join(" · ") || "Contenido actualizado";
        const paid = order.paidAmount ?? order.payments?.reduce((sum, payment) => sum + payment.amount, 0) ?? (["pagado", "reembolsado"].includes(order.paymentStatus) ? order.total : order.paymentStatus === "pago_parcial" ? order.total / 2 : 0);
        changed = true;
        return {
          ...order,
          lines: normalizedLines,
          subtotal,
          manualDiscount: safeManualDiscount,
          discount,
          total,
          paidAmount: paid,
          paymentStatus: order.paymentStatus === "reembolsado" ? "reembolsado" : paid <= 0 ? "pago_pendiente" : paid >= total ? "pagado" : "pago_parcial",
          adjustments: [...(order.adjustments ?? []), { id: `adjustment_${Date.now()}`, reason: reason.trim(), summary, beforeLines: order.lines, afterLines: normalizedLines, beforeDiscount: order.manualDiscount ?? 0, afterDiscount: safeManualDiscount, createdAt: now }],
          updatedAt: now,
        };
      }),
    }));
    return changed;
  },
}));
