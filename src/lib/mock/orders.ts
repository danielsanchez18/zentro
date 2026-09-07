export type OrderStatus =
  | "nuevo"
  | "confirmado"
  | "en_preparacion"
  | "listo"
  | "entregado"
  | "cancelado";

export type OrderPaymentStatus =
  | "pago_pendiente"
  | "pago_parcial"
  | "pagado"
  | "reembolsado";

export type OrderServiceType = "mesa" | "recojo" | "delivery";
export type OrderChannel = "pos" | "web" | "marketplace";

export interface OrderLine {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  notes?: string;
}

export interface CustomerOrder {
  id: string;
  number: string;
  customerName: string;
  customerPhone?: string;
  serviceType: OrderServiceType;
  channel: OrderChannel;
  tableName?: string;
  deliveryAddress?: string;
  status: OrderStatus;
  paymentStatus: OrderPaymentStatus;
  lines: OrderLine[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  promotionName?: string;
  promisedAt: string;
  createdAt: string;
  updatedAt: string;
}

const line = (
  id: string,
  productId: string,
  name: string,
  quantity: number,
  unitPrice: number,
  discount = 0,
  notes?: string,
): OrderLine => ({
  id,
  productId,
  name,
  quantity,
  unitPrice,
  discount,
  total: quantity * unitPrice - discount,
  notes,
});

export const orders: CustomerOrder[] = [
  {
    id: "ord_1048",
    number: "PED-1048",
    customerName: "Camila Navarro",
    customerPhone: "+51 982 145 920",
    serviceType: "delivery",
    channel: "web",
    deliveryAddress: "Av. Conquistadores 420, San Isidro",
    status: "nuevo",
    paymentStatus: "pagado",
    lines: [
      line("ol_1", "prod_cloth_1", "Polo Oversize Algodón Pima", 2, 79.9, 0, "Talla M · Color Negro"),
      line("ol_2", "prod_cloth_2", "Casaca Denim Vintage", 1, 159.0, 15.9),
    ],
    subtotal: 318.8,
    discount: 15.9,
    deliveryFee: 12.0,
    total: 314.9,
    promotionName: "Colección Primavera",
    promisedAt: "2026-09-06T20:30:00.000Z",
    createdAt: "2026-09-06T19:15:00.000Z",
    updatedAt: "2026-09-06T19:15:00.000Z",
  },
  {
    id: "ord_1047",
    number: "PED-1047",
    customerName: "Carlos Morales (Mascota: Toby)",
    customerPhone: "+51 987 245 610",
    serviceType: "mesa",
    channel: "pos",
    tableName: "Mostrador 01",
    status: "confirmado",
    paymentStatus: "pagado",
    lines: [
      line("ol_3", "prod_vet_1", "Alimento Premium Canino 3kg", 1, 98.0),
      line("ol_4", "prod_vet_2", "Snack Dental Mascotas", 2, 18.5),
      line("ol_5", "prod_vet_3", "Pipeta Antipulgas 10-20kg", 1, 45.0),
    ],
    subtotal: 180.0,
    discount: 18.0,
    deliveryFee: 0,
    total: 162.0,
    promotionName: "Cuidado de Mascotas",
    promisedAt: "2026-09-06T19:40:00.000Z",
    createdAt: "2026-09-06T19:03:00.000Z",
    updatedAt: "2026-09-06T19:08:00.000Z",
  },
  {
    id: "ord_1046",
    number: "PED-1046",
    customerName: "Mesa 04",
    serviceType: "mesa",
    channel: "pos",
    tableName: "Mesa 04",
    status: "en_preparacion",
    paymentStatus: "pago_parcial",
    lines: [
      line("ol_6", "prod_food_1", "Hamburguesa Clásica con Papas", 2, 28.5, 0, "Una sin salsas"),
      line("ol_7", "prod_food_2", "Jugo de Maracuyá 500ml", 2, 9.5),
    ],
    subtotal: 76.0,
    discount: 0,
    deliveryFee: 0,
    total: 76.0,
    promisedAt: "2026-09-06T19:45:00.000Z",
    createdAt: "2026-09-06T18:52:00.000Z",
    updatedAt: "2026-09-06T19:10:00.000Z",
  },
  {
    id: "ord_1045",
    number: "PED-1045",
    customerName: "Diego Fernández",
    customerPhone: "+51 944 183 725",
    serviceType: "recojo",
    channel: "web",
    status: "listo",
    paymentStatus: "pagado",
    lines: [
      line("ol_8", "prod_shoes_1", "Zapatillas Urbanas Blancas", 1, 189.0, 0, "Talla 41"),
      line("ol_9", "prod_shoes_2", "Pack Calcetines Algodón x3", 1, 24.9),
    ],
    subtotal: 213.9,
    discount: 0,
    deliveryFee: 0,
    total: 213.9,
    promisedAt: "2026-09-06T19:15:00.000Z",
    createdAt: "2026-09-06T18:34:00.000Z",
    updatedAt: "2026-09-06T19:12:00.000Z",
  },
  {
    id: "ord_1044",
    number: "PED-1044",
    customerName: "Mariana Silva",
    customerPhone: "+51 965 420 118",
    serviceType: "delivery",
    channel: "marketplace",
    deliveryAddress: "Calle Los Pinos 142 Dpto 302, Miraflores",
    status: "entregado",
    paymentStatus: "pagado",
    lines: [
      line("ol_10", "prod_beauty_1", "Sérum Facial Vitamina C 30ml", 1, 85.0),
      line("ol_11", "prod_beauty_2", "Protector Solar Facial SPF 50+", 1, 68.0),
    ],
    subtotal: 153.0,
    discount: 15.3,
    deliveryFee: 8.0,
    total: 145.7,
    promotionName: "Skincare Primavera",
    promisedAt: "2026-09-06T18:35:00.000Z",
    createdAt: "2026-09-06T18:02:00.000Z",
    updatedAt: "2026-09-06T18:31:00.000Z",
  },
  {
    id: "ord_1043",
    number: "PED-1043",
    customerName: "Luis Mendoza",
    customerPhone: "+51 912 630 847",
    serviceType: "delivery",
    channel: "web",
    deliveryAddress: "Jr. Risso 326, Lince",
    status: "cancelado",
    paymentStatus: "reembolsado",
    lines: [
      line("ol_12", "prod_food_3", "Torta de Chocolate Familiar", 1, 55.0),
    ],
    subtotal: 55.0,
    discount: 0,
    deliveryFee: 6.0,
    total: 61.0,
    promisedAt: "2026-09-06T18:30:00.000Z",
    createdAt: "2026-09-06T17:44:00.000Z",
    updatedAt: "2026-09-06T17:50:00.000Z",
  },
];

export const formatOrderMoney = (value: number) =>
  new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(value);

export const orderServiceLabel = (type: OrderServiceType) =>
  type === "mesa"
    ? "En local / Mesa"
    : type === "recojo"
      ? "Recojo en tienda"
      : "Envío a domicilio";

export const orderChannelLabel = (channel: OrderChannel) =>
  channel === "pos"
    ? "Punto de venta"
    : channel === "web"
      ? "Sitio web"
      : "Marketplace";
