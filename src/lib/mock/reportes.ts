import type { CustomerOrder, OrderChannel, OrderServiceType } from "./orders";
import { orderChannelLabel, orderServiceLabel } from "./orders";
import type { InventoryItem } from "./inventory";
import { inventoryStatus } from "./inventory";
import type { PurchaseOrder } from "./purchases";
import type { CrmCustomer } from "./crm";
import type { Appointment } from "./agenda";
import type { CashMovement } from "./cash";
import { cashPaymentMethodLabel } from "./cash";

/**
 * Reportes — agregaciones de solo lectura sobre los mocks existentes.
 * No modifica ningún store: calcula indicadores a partir de los datos
 * locales de Pedidos, Caja, Inventario, Compras, CRM y Agenda.
 */

export type ReportPeriod = "hoy" | "7d" | "30d" | "90d" | "todo";

export const reportPeriods: ReportPeriod[] = ["hoy", "7d", "30d", "90d", "todo"];

export const reportPeriodLabel: Record<ReportPeriod, string> = {
  hoy: "Hoy",
  "7d": "Últimos 7 días",
  "30d": "Últimos 30 días",
  "90d": "Últimos 90 días",
  todo: "Todo",
};

export interface ReportRange {
  from: Date;
  to: Date;
  label: string;
}

export function periodRange(period: ReportPeriod, now = new Date()): ReportRange {
  const from = new Date(now);
  from.setHours(0, 0, 0, 0);
  if (period === "hoy") {
    return { from, to: now, label: reportPeriodLabel.hoy };
  }
  if (period === "todo") {
    return { from: new Date(2020, 0, 1), to: now, label: reportPeriodLabel.todo };
  }
  const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
  from.setDate(from.getDate() - (days - 1));
  return { from, to: now, label: reportPeriodLabel[period] };
}

/** Valida si una fecha (string ISO/offset o Date) cae dentro del rango. */
export function isInRange(date: string | Date, range: ReportRange): boolean {
  const d = new Date(date);
  return d >= range.from && d <= range.to;
}

/** Pedidos con pago registrado y no cancelados/reembolsados, dentro del rango. */
export function eligibleOrders(
  orders: CustomerOrder[],
  range: ReportRange,
): CustomerOrder[] {
  return orders.filter(
    (order) =>
      (order.paymentStatus === "pagado" || order.paymentStatus === "pago_parcial") &&
      order.status !== "cancelado" &&
      isInRange(order.createdAt, range),
  );
}

const money = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

export const formatReportMoney = (value: number) => money.format(value);

const dayLabel = new Intl.DateTimeFormat("es-PE", {
  day: "2-digit",
  month: "short",
});

/** Serie continua de días desde el inicio del rango hasta hoy. */
function daySeries(range: ReportRange): { label: string; date: Date }[] {
  const days: { label: string; date: Date }[] = [];
  const cursor = new Date(range.from);
  cursor.setHours(0, 0, 0, 0);
  const end = new Date(range.to);
  end.setHours(0, 0, 0, 0);
  while (cursor <= end) {
    days.push({ label: dayLabel.format(cursor).replace(".", ""), date: new Date(cursor) });
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

export interface SalesByDay {
  label: string;
  total: number;
  orders: number;
}

export interface BreakItem {
  label: string;
  value: number;
  count: number;
}

export interface SalesSummary {
  total: number;
  count: number;
  avgTicket: number;
  byDay: SalesByDay[];
  byChannel: BreakItem[];
  byMethod: BreakItem[];
  byStatus: BreakItem[];
  byService: BreakItem[];
}

export function salesSummary(
  orders: CustomerOrder[],
  cashMovements: CashMovement[],
  range: ReportRange,
): SalesSummary {
  const eligible = eligibleOrders(orders, range);

  const total = eligible.reduce((sum, o) => sum + o.total, 0);
  const count = eligible.length;
  const avgTicket = count > 0 ? total / count : 0;

  // Serie por día (barras continuas del rango).
  const byDay: SalesByDay[] = daySeries(range).map(({ label, date }) => {
    let dayTotal = 0;
    let dayOrders = 0;
    for (const o of eligible) {
      const d = new Date(o.createdAt);
      if (d.getFullYear() === date.getFullYear() && d.getMonth() === date.getMonth() && d.getDate() === date.getDate()) {
        dayTotal += o.total;
        dayOrders += 1;
      }
    }
    return { label, total: dayTotal, orders: dayOrders };
  });

  // Canales (channel del pedido).
  const channelMap = new Map<OrderChannel, number>();
  for (const o of eligible) {
    channelMap.set(o.channel, (channelMap.get(o.channel) ?? 0) + o.total);
  }
  const byChannel: BreakItem[] = [...channelMap.entries()]
    .map(([channel, value]) => ({ label: orderChannelLabel(channel), value, count: eligible.filter((o) => o.channel === channel).length }))
    .sort((a, b) => b.value - a.value);

  // Método de pago: pedidos elegibles + movimientos de venta de caja sin pedido asociado.
  const methodMap = new Map<string, number>();
  const methodCountMap = new Map<string, number>();
  for (const o of eligible) {
    if (o.paymentMethod) {
      const label = cashPaymentMethodLabel(o.paymentMethod);
      methodMap.set(label, (methodMap.get(label) ?? 0) + o.total);
      methodCountMap.set(label, (methodCountMap.get(label) ?? 0) + 1);
    }
  }
  const eligibleNumbers = new Set(eligible.map((o) => o.number));
  for (const m of cashMovements) {
    if (m.type !== "venta" || !isInRange(m.createdAt, range)) continue;
    if (m.orderNumber && eligibleNumbers.has(m.orderNumber)) continue; // ya contado vía pedido
    const label = cashPaymentMethodLabel(m.method);
    methodMap.set(label, (methodMap.get(label) ?? 0) + m.amount);
    methodCountMap.set(label, (methodCountMap.get(label) ?? 0) + 1);
  }
  const byMethod: BreakItem[] = [...methodMap.entries()]
    .map(([label, value]) => ({ label, value, count: methodCountMap.get(label) ?? 0 }))
    .sort((a, b) => b.value - a.value);

  // Estados de pedido elegibles.
  const statusMap = new Map<string, number>();
  for (const o of eligible) {
    statusMap.set(o.status, (statusMap.get(o.status) ?? 0) + 1);
  }
  const statusLabels: Record<string, string> = {
    nuevo: "Nuevos",
    confirmado: "Confirmados",
    en_preparacion: "En preparación",
    listo: "Listos",
    entregado: "Entregados",
    cancelado: "Cancelados",
  };
  const byStatus: BreakItem[] = [...statusMap.entries()]
    .map(([status, c]) => ({ label: statusLabels[status] ?? status, value: c, count: c }))
    .sort((a, b) => b.value - a.value);

  // Tipo de servicio.
  const serviceMap = new Map<OrderServiceType, number>();
  for (const o of eligible) {
    serviceMap.set(o.serviceType, (serviceMap.get(o.serviceType) ?? 0) + 1);
  }
  const byService: BreakItem[] = [...serviceMap.entries()]
    .map(([service, c]) => ({ label: orderServiceLabel(service), value: c, count: c }))
    .sort((a, b) => b.value - a.value);

  return { total, count, avgTicket, byDay, byChannel, byMethod, byStatus, byService };
}

export interface ProductMargin {
  productId: string;
  name: string;
  unitsSold: number;
  revenue: number;
  cost: number;
  margin: number;
  marginRate: number;
}

/** Margen bruto estimado por producto a partir de líneas de pedidos pagados.
 *  El costo unitario se busca primero por productId en el inventario; si el
 *  producto no está inventariado se resuelve por nombre y, en último caso, se
 *  estima con la tasa de costo estándar del mock (58% del precio de venta). */
export function topProductMargins(
  orders: CustomerOrder[],
  inventoryItems: InventoryItem[],
  range: ReportRange,
): ProductMargin[] {
  const costByProduct = new Map<string, number>();
  const costByName = new Map<string, number>();
  for (const item of inventoryItems) {
    costByProduct.set(item.productId, item.unitCost);
    costByName.set(item.productName, item.unitCost);
  }
  const fallbackCostRate = 0.58;

  const map = new Map<string, ProductMargin>();
  for (const o of eligibleOrders(orders, range)) {
    for (const line of o.lines) {
      const current = map.get(line.productId) ?? {
        productId: line.productId,
        name: line.name,
        unitsSold: 0,
        revenue: 0,
        cost: 0,
        margin: 0,
        marginRate: 0,
      };
      const cost =
        costByProduct.get(line.productId) ??
        costByName.get(line.name) ??
        line.unitPrice * fallbackCostRate;
      current.unitsSold += line.quantity;
      current.revenue += line.total;
      current.cost += line.quantity * cost;
      current.margin = current.revenue - current.cost;
      current.marginRate =
        current.revenue > 0 ? (current.margin / current.revenue) * 100 : 0;
      map.set(line.productId, current);
    }
  }
  return [...map.values()].sort((a, b) => b.margin - a.margin);
}

export interface InventorySnapshot {
  value: number;
  items: number;
  lowCount: number;
  outCount: number;
  critical: InventoryItem[];
}

export function inventorySnapshot(items: InventoryItem[]): InventorySnapshot {
  const value = items.reduce((sum, item) => sum + item.currentStock * item.unitCost, 0);
  const low = items.filter((item) => inventoryStatus(item) === "bajo");
  const out = items.filter((item) => inventoryStatus(item) === "agotado");
  const critical = [...low, ...out].sort((a, b) => a.currentStock - b.currentStock);
  return { value, items: items.length, lowCount: low.length, outCount: out.length, critical };
}

export interface SupplierBreak {
  supplierId: string;
  supplierName: string;
  total: number;
  count: number;
}

export function purchasesBySupplier(
  purchaseOrders: PurchaseOrder[],
  range: ReportRange,
): SupplierBreak[] {
  const map = new Map<string, SupplierBreak>();
  for (const po of purchaseOrders) {
    if (po.status === "cancelada" || !isInRange(po.issuedAt, range)) continue;
    const current = map.get(po.supplierId) ?? {
      supplierId: po.supplierId,
      supplierName: po.supplierName,
      total: 0,
      count: 0,
    };
    current.total += po.total;
    current.count += 1;
    map.set(po.supplierId, current);
  }
  return [...map.values()].sort((a, b) => b.total - a.total);
}

export interface CustomerTop {
  id: string;
  name: string;
  kind: string;
  totalSpent: number;
  totalOrders: number;
  lastOrderAt?: string;
}

export function topCustomers(
  customers: CrmCustomer[],
  limit = 5,
): CustomerTop[] {
  return customers
    .map((c) => ({
      id: c.id,
      name: c.name,
      kind: c.kind === "empresa" ? "Empresa" : "Persona",
      totalSpent: c.totalSpent,
      totalOrders: c.totalOrders,
      lastOrderAt: c.lastOrderAt,
    }))
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, limit);
}

export function newCustomers(
  customers: CrmCustomer[],
  range: ReportRange,
): CrmCustomer[] {
  return customers
    .filter((c) => isInRange(c.createdAt, range))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export interface AppointmentBreak {
  status: string;
  count: number;
  revenue: number;
}

const appointmentStatusLabels: Record<string, string> = {
  pendiente_confirmacion: "Pendientes",
  confirmada: "Confirmadas",
  en_curso: "En curso",
  completada: "Completadas",
  cancelada: "Canceladas",
  no_asistio: "No asistieron",
};

export function appointmentsByStatus(
  appointments: Appointment[],
  range: ReportRange,
): AppointmentBreak[] {
  const map = new Map<string, AppointmentBreak>();
  for (const a of appointments) {
    // La cita pertenece al período por su fecha de inicio.
    if (!isInRange(a.startsAt, range)) continue;
    const current = map.get(a.status) ?? {
      status: appointmentStatusLabels[a.status] ?? a.status,
      count: 0,
      revenue:
        a.status === "no_asistio" || a.status === "cancelada"
          ? 0
          : a.paidAmount,
    };
    current.count += 1;
    current.revenue +=
      a.status === "no_asistio" || a.status === "cancelada" ? 0 : a.paidAmount;
    map.set(a.status, current);
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}