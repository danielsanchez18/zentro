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

export interface PosStaffMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export const posStaff: PosStaffMember[] = [
  { id: "staff_1", name: "Daniel Sánchez", role: "Administrador", avatar: "https://i.pravatar.cc/120?img=68" },
  { id: "staff_2", name: "María Torres", role: "Atención", avatar: "https://i.pravatar.cc/120?img=47" },
  { id: "staff_3", name: "Luis Mendoza", role: "Caja", avatar: "https://i.pravatar.cc/120?img=12" },
  { id: "staff_4", name: "Fernanda Soto", role: "Ventas", avatar: "https://i.pravatar.cc/120?img=32" },
  { id: "staff_5", name: "Carlos Ramos", role: "Cajero", avatar: "https://i.pravatar.cc/120?img=15" },
];
