export type PosServicePointStatus =
  | "disponible"
  | "ocupado"
  | "reservado"
  | "inactivo";

export interface PosServicePoint {
  id: string;
  name: string;
  kind: "mesa" | "mostrador" | "box" | "cabina" | "silla";
  status: PosServicePointStatus;
  capacity: number;
  groupId?: string;
  memberIds?: string[];
  associatedOrderId?: string;
}

import type { CrmCustomer } from "@/lib/mock/crm";
export type PosCustomer = CrmCustomer;

export const posServicePoints: PosServicePoint[] = [
  { id: "point_1", name: "Mesa 01", kind: "mesa", status: "disponible", capacity: 4 },
  { id: "point_2", name: "Mesa 02", kind: "mesa", status: "ocupado", capacity: 4, associatedOrderId: "ord_1048" },
  { id: "point_3", name: "Mesa 03", kind: "mesa", status: "disponible", capacity: 4 },
  { id: "point_4", name: "Mesa 04", kind: "mesa", status: "disponible", capacity: 4 },
  { id: "point_5", name: "Mostrador 01", kind: "mostrador", status: "disponible", capacity: 1 },
  { id: "point_6", name: "Mostrador 02", kind: "mostrador", status: "disponible", capacity: 1 },
  { id: "point_7", name: "Mostrador 03", kind: "mostrador", status: "ocupado", capacity: 1, associatedOrderId: "ord_1047" },
];

export const posStaff = [
  { id: "staff_1", name: "Daniel Sánchez", role: "Administrador" },
  { id: "staff_2", name: "María Torres", role: "Atención" },
  { id: "staff_3", name: "Luis Mendoza", role: "Caja" },
];
