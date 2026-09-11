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

export interface PosCustomer {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

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

export const posCustomers: PosCustomer[] = [
  { id: "customer_1", name: "Amanda Harvey", email: "amanda.harvey@correo.pe", avatar: "https://i.pravatar.cc/120?img=47" },
  { id: "customer_2", name: "Lucía Fernández", email: "lucia.fernandez@correo.pe", avatar: "https://i.pravatar.cc/120?img=32" },
  { id: "customer_3", name: "Renato Chávez", email: "renato.chavez@correo.pe", avatar: "https://i.pravatar.cc/120?img=12" },
  { id: "customer_4", name: "Milagros Salazar", email: "milagros.salazar@correo.pe", avatar: "https://i.pravatar.cc/120?img=45" },
];
