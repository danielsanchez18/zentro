export type CustomerStatus = "activo" | "inactivo";
export type CustomerKind = "persona" | "empresa";
export type CustomerChannel = "pos" | "web" | "marketplace" | "whatsapp" | "manual";

export interface CustomerAddress {
  id: string;
  label: string;
  address: string;
  district: string;
  city: string;
  reference?: string;
  isDefault: boolean;
}

export interface ActivityChangeItem {
  icon?: "clock" | "calendar" | "dollar" | "check";
  label: string;
  value: string;
}

export interface ActivityOrderSummary {
  date: string;
  method: string;
  methodNumber?: string;
  status: "pending" | "completed" | "refunded";
  statusLabel?: string;
  amount: number;
  orderId?: string;
}

export interface CustomerActivity {
  id: string;
  type: "creacion" | "pedido" | "nota" | "actualizacion" | "llamada";
  title: string;
  description: string;
  createdAt: string;
  storeName?: string;
  changes?: ActivityChangeItem[];
  callDuration?: string;
  orderSummary?: ActivityOrderSummary;
}

export interface CrmCustomer {
  id: string;
  kind: CustomerKind;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  documentType?: "DNI" | "CE" | "RUC";
  documentNumber?: string;
  status: CustomerStatus;
  preferredChannel: CustomerChannel;
  tags: string[];
  notes?: string;
  addresses: CustomerAddress[];
  totalOrders: number;
  totalSpent: number;
  lastOrderAt?: string;
  createdAt: string;
  updatedAt: string;
  activity: CustomerActivity[];
}

export const crmCustomers: CrmCustomer[] = [
  {
    id: "customer_1", kind: "persona", name: "Amanda Harvey", email: "amanda.harvey@correo.pe", phone: "+51 987 245 610", avatar: "https://i.pravatar.cc/120?img=47", documentType: "DNI", documentNumber: "74851236", status: "activo", preferredChannel: "web", tags: ["Frecuente", "Delivery"], notes: "Prefiere contacto por WhatsApp.", totalOrders: 12, totalSpent: 1840.5, lastOrderAt: "2026-09-06T19:15:00.000Z", createdAt: "2026-02-14T15:20:00.000Z", updatedAt: "2026-09-06T19:15:00.000Z",
    addresses: [
      { id: "addr_1", label: "Casa", address: "Av. Balta 825", district: "Chiclayo", city: "Lambayeque", reference: "Frente al parque", isDefault: true },
      { id: "addr_1_b", label: "Oficina", address: "Calle Elías Aguirre 450", district: "Pimentel", city: "Lambayeque", reference: "Piso 3, Of. 302", isDefault: false },
    ],
    activity: [
      {
        id: "act_1",
        type: "actualizacion",
        title: "cambió Horas de contacto y otros 3 atributos en",
        description: "Actualización de preferencias y parámetros comerciales.",
        createdAt: "2026-09-11T10:12:00.000Z",
        storeName: "Zentro",
        changes: [
          { icon: "clock", label: "Horas de contacto", value: "09:00 - 18:00" },
          { icon: "calendar", label: "Días de atención", value: "18 días / mes" },
          { icon: "dollar", label: "Ticket promedio", value: "S/ 184.05" },
          { icon: "check", label: "Pedidos completados", value: "12" },
        ],
      },
      {
        id: "act_2",
        type: "llamada",
        title: "Llamada entrante de",
        description: "Consulta de nuevos ingresos y confirmación de delivery.",
        createdAt: "2026-09-10T17:38:00.000Z",
        callDuration: "1m:25s",
      },
      {
        id: "act_3",
        type: "pedido",
        title: "registró un pedido por",
        description: "Pedido PED-1054 pagado con tarjeta Visa.",
        createdAt: "2026-09-08T19:15:00.000Z",
        orderSummary: {
          date: "08 Sep, 2026",
          method: "VISA",
          methodNumber: "**** 7887",
          status: "pending",
          statusLabel: "Pending",
          amount: 314.9,
          orderId: "ord_1054",
        },
      },
    ],
  },
  {
    id: "customer_2", kind: "persona", name: "Lucía Fernández", email: "lucia.fernandez@correo.pe", phone: "+51 945 381 227", avatar: "https://i.pravatar.cc/120?img=32", documentType: "DNI", documentNumber: "70184592", status: "activo", preferredChannel: "whatsapp", tags: ["Mayorista"], totalOrders: 7, totalSpent: 3250, lastOrderAt: "2026-08-29T16:30:00.000Z", createdAt: "2026-03-10T12:00:00.000Z", updatedAt: "2026-08-29T16:30:00.000Z",
    addresses: [{ id: "addr_2", label: "Casa", address: "Calle Los Pinos 184", district: "La Victoria", city: "Lambayeque", isDefault: true }], activity: [{ id: "act_3", type: "pedido", title: "Pedido registrado", description: "Venta mayorista registrada manualmente.", createdAt: "2026-08-29T16:30:00.000Z" }],
  },
  {
    id: "customer_3", kind: "persona", name: "Renato Chávez", email: "renato.chavez@correo.pe", phone: "+51 976 402 115", avatar: "https://i.pravatar.cc/120?img=12", status: "activo", preferredChannel: "pos", tags: ["Nuevo"], totalOrders: 2, totalSpent: 278, lastOrderAt: "2026-09-02T18:10:00.000Z", createdAt: "2026-08-18T10:15:00.000Z", updatedAt: "2026-09-02T18:10:00.000Z",
    addresses: [{ id: "addr_3", label: "Principal", address: "Av. Grau 1240", district: "Chiclayo", city: "Lambayeque", isDefault: true }], activity: [{ id: "act_4", type: "creacion", title: "Cliente creado", description: "Perfil creado en caja.", createdAt: "2026-08-18T10:15:00.000Z" }],
  },
  {
    id: "customer_4", kind: "persona", name: "Milagros Salazar", email: "milagros.salazar@correo.pe", phone: "+51 933 718 604", avatar: "https://i.pravatar.cc/120?img=45", status: "inactivo", preferredChannel: "marketplace", tags: ["Marketplace"], totalOrders: 4, totalSpent: 619.9, lastOrderAt: "2026-06-22T20:00:00.000Z", createdAt: "2026-01-05T09:30:00.000Z", updatedAt: "2026-07-01T11:00:00.000Z",
    addresses: [{ id: "addr_4", label: "Casa", address: "Jr. San José 456", district: "Lambayeque", city: "Lambayeque", isDefault: true }], activity: [{ id: "act_5", type: "actualizacion", title: "Cliente deshabilitado", description: "El perfil dejó de estar disponible para nuevas ventas.", createdAt: "2026-07-01T11:00:00.000Z" }],
  },
  {
    id: "customer_5", kind: "empresa", name: "Distribuciones Norte SAC", email: "compras@disnorte.pe", phone: "+51 974 110 823", documentType: "RUC", documentNumber: "20608451239", status: "activo", preferredChannel: "manual", tags: ["Empresa", "Mayorista"], totalOrders: 18, totalSpent: 12480, lastOrderAt: "2026-09-04T14:45:00.000Z", createdAt: "2025-11-12T13:00:00.000Z", updatedAt: "2026-09-04T14:45:00.000Z",
    addresses: [{ id: "addr_5", label: "Oficina", address: "Panamericana Norte km 775", district: "Lambayeque", city: "Lambayeque", isDefault: true }], activity: [{ id: "act_6", type: "nota", title: "Condición comercial", description: "Coordinar pedidos con 24 horas de anticipación.", createdAt: "2026-08-20T10:00:00.000Z" }],
  },
];

export const crmChannelLabel = (channel: CustomerChannel) => ({ pos: "Punto de venta", web: "Sitio web", marketplace: "Marketplace", whatsapp: "WhatsApp", manual: "Registro manual" })[channel];
export const crmMoney = (value: number) => new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(value);
export const customerPrimaryAddress = (customer: CrmCustomer) => customer.addresses.find((address) => address.isDefault) ?? customer.addresses[0];
