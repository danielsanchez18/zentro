export type CashSessionStatus = "abierta" | "cerrada";
export type CashMovementType = "venta" | "ingreso" | "retiro" | "gasto" | "reembolso" | "ajuste";
export type CashPaymentMethod = "efectivo" | "tarjeta" | "yape" | "plin" | "transferencia";

export interface CashTerminal { id: string; name: string; locationId: string; locationName: string; active: boolean; }
export interface CashSettings {
  requireOpenSessionForCash: boolean;
  requireOpenSessionForDigital: boolean;
  requireClosingNotesOnDifference: boolean;
  acceptedMethods: CashPaymentMethod[];
}
export interface CashSession {
  id: string; terminalId: string; terminalName: string; locationId: string; locationName: string; status: CashSessionStatus;
  openedById: string; openedByName: string; openedAt: string; openingAmount: number;
  closedAt?: string; closedByName?: string; expectedCash?: number; countedCash?: number; difference?: number; notes?: string;
}
export interface CashMovement {
  id: string; sessionId: string; type: CashMovementType; method: CashPaymentMethod; amount: number;
  direction: "entrada" | "salida"; concept: string; createdAt: string; responsibleName: string;
  orderNumber?: string; reference?: string;
}

export const cashTerminalsMock: CashTerminal[] = [
  { id: "terminal_1", name: "Caja principal", locationId: "loc_1", locationName: "Monsefú", active: true },
  { id: "terminal_2", name: "Caja salón", locationId: "loc_1", locationName: "Monsefú", active: true },
  { id: "terminal_3", name: "Caja auxiliar", locationId: "loc_1", locationName: "Monsefú", active: true },
];

export const cashSettingsMock: CashSettings = {
  requireOpenSessionForCash: true,
  requireOpenSessionForDigital: false,
  requireClosingNotesOnDifference: true,
  acceptedMethods: ["efectivo", "tarjeta", "yape", "plin", "transferencia"],
};

export const cashSessionsMock: CashSession[] = [
  { id: "session_1", terminalId: "terminal_1", terminalName: "Caja principal", locationId: "loc_1", locationName: "Monsefú", status: "abierta", openedById: "staff_3", openedByName: "Luis Mendoza", openedAt: "2026-09-22T08:02:00-05:00", openingAmount: 250 },
  { id: "session_2", terminalId: "terminal_2", terminalName: "Caja salón", locationId: "loc_1", locationName: "Monsefú", status: "abierta", openedById: "staff_1", openedByName: "Daniel Sánchez", openedAt: "2026-09-22T09:10:00-05:00", openingAmount: 150 },
  { id: "session_3", terminalId: "terminal_1", terminalName: "Caja principal", locationId: "loc_1", locationName: "Monsefú", status: "cerrada", openedById: "staff_3", openedByName: "Luis Mendoza", openedAt: "2026-09-21T08:05:00-05:00", openingAmount: 200, closedAt: "2026-09-21T22:14:00-05:00", closedByName: "Luis Mendoza", expectedCash: 1846.5, countedCash: 1845, difference: -1.5 },
];

export const cashMovementsMock: CashMovement[] = [
  { id: "cash_move_1", sessionId: "session_1", type: "venta", method: "efectivo", amount: 86, direction: "entrada", concept: "Cobro de pedido", createdAt: "2026-09-22T10:42:00-05:00", responsibleName: "Luis Mendoza", orderNumber: "PED-1052" },
  { id: "cash_move_2", sessionId: "session_1", type: "venta", method: "tarjeta", amount: 124.9, direction: "entrada", concept: "Cobro de pedido", createdAt: "2026-09-22T10:18:00-05:00", responsibleName: "Luis Mendoza", orderNumber: "PED-1051", reference: "VISA 4831" },
  { id: "cash_move_3", sessionId: "session_2", type: "venta", method: "yape", amount: 48, direction: "entrada", concept: "Adelanto de pedido", createdAt: "2026-09-22T09:54:00-05:00", responsibleName: "Daniel Sánchez", orderNumber: "PED-1050" },
  { id: "cash_move_4", sessionId: "session_1", type: "retiro", method: "efectivo", amount: 100, direction: "salida", concept: "Retiro preventivo de efectivo", createdAt: "2026-09-22T09:30:00-05:00", responsibleName: "Luis Mendoza", reference: "Autorizado por Daniel Sánchez" },
  { id: "cash_move_5", sessionId: "session_2", type: "gasto", method: "efectivo", amount: 18.5, direction: "salida", concept: "Compra de materiales menores", createdAt: "2026-09-22T09:22:00-05:00", responsibleName: "Daniel Sánchez" },
];

export const cashMovementTypeLabel = (type: CashMovementType) => ({ venta: "Venta", ingreso: "Ingreso", retiro: "Retiro", gasto: "Gasto", reembolso: "Reembolso", ajuste: "Ajuste" })[type];
export const cashPaymentMethodLabel = (method: CashPaymentMethod) => ({ efectivo: "Efectivo", tarjeta: "Tarjeta", yape: "Yape", plin: "Plin", transferencia: "Transferencia" })[method];
