export type InvoiceType = "boleta" | "factura";
export type InvoiceStatus = "emitido" | "enviado" | "pagado" | "anulado";
export type InvoiceNoteType = "credito" | "debito";

export interface InvoiceItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
  igv: number;
}

export interface InvoiceCustomer {
  id?: string;
  documentType: "dni" | "ruc";
  documentNumber: string;
  name: string;
  tradeName?: string;
  address?: string;
  email?: string;
}

/** Snapshot de la configuración fiscal del negocio al momento de emitir.
 *  Un cambio posterior en la config no debe afectar comprobantes ya emitidos. */
export interface FiscalSnapshot {
  businessName: string;
  ruc: string;
  address: string;
  igvRate: number;
}

export interface Invoice {
  id: string;
  number: string;
  type: InvoiceType;
  status: InvoiceStatus;
  orderId: string;
  orderNumber: string;
  customerId?: string;
  customer: InvoiceCustomer;
  fiscalSnapshot?: FiscalSnapshot;
  items: InvoiceItem[];
  subtotal: number;
  igv: number;
  total: number;
  currency: string;
  notes?: string;
  issuedAt: string;
  sentAt?: string;
  paidAt?: string;
  annulledAt?: string;
  annulledReason?: string;
  sessionId?: string;
  cashMovementId?: string;
  createdAt: string;
}

export interface InvoiceNote {
  id: string;
  number: string;
  type: InvoiceNoteType;
  reason: "descuento" | "devolucion" | "anulacion" | "recargo" | "intereses" | "penalidades";
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  notes?: string;
  issuedAt: string;
  createdAt: string;
}

export interface BillingConfig {
  businessName: string;
  ruc: string;
  address: string;
  logo?: string;
  igvRate: number;
  sequences: {
    boleta: number;
    factura: number;
    notaCredito: number;
    notaDebito: number;
  };
}

export const billingConfigMock: BillingConfig = {
  businessName: "Zentro Restaurant S.A.C.",
  ruc: "20512345678",
  address: "Av. Principal 123, Monsefú, Chiclayo",
  igvRate: 0.18,
  sequences: {
    boleta: 15,
    factura: 8,
    notaCredito: 3,
    notaDebito: 1,
  },
};

export const billingInvoicesMock: Invoice[] = [
  {
    id: "inv_1",
    number: "B001-0012",
    type: "boleta",
    status: "pagado",
    orderId: "ord_1052",
    orderNumber: "PED-1052",
    customer: {
      documentType: "dni",
      documentNumber: "70123456",
      name: "María García López",
      email: "maria.garcia@email.com",
    },
    items: [
      {
        id: "item_1",
        productId: "prod_1",
        productName: "Ají de gallina",
        sku: "AJI-001",
        quantity: 2,
        unitPrice: 32,
        discount: 0,
        subtotal: 64,
        igv: 11.52,
      },
      {
        id: "item_2",
        productId: "prod_2",
        productName: "Inca Kola 500ml",
        sku: "INK-001",
        quantity: 2,
        unitPrice: 5,
        discount: 0,
        subtotal: 10,
        igv: 1.8,
      },
    ],
    subtotal: 74,
    igv: 13.32,
    total: 87.32,
    currency: "PEN",
    issuedAt: "2026-09-22T10:45:00-05:00",
    sentAt: "2026-09-22T10:46:00-05:00",
    paidAt: "2026-09-22T10:42:00-05:00",
    sessionId: "session_1",
    cashMovementId: "cash_move_1",
    createdAt: "2026-09-22T10:45:00-05:00",
  },
  {
    id: "inv_2",
    number: "B001-0013",
    type: "boleta",
    status: "pagado",
    orderId: "ord_1051",
    orderNumber: "PED-1051",
    customer: {
      documentType: "dni",
      documentNumber: "70987654",
      name: "Carlos Rodríguez Pérez",
    },
    items: [
      {
        id: "item_3",
        productId: "prod_3",
        productName: "Lomo saltado",
        sku: "LOM-001",
        quantity: 1,
        unitPrice: 45,
        discount: 5,
        subtotal: 40,
        igv: 7.2,
      },
      {
        id: "item_4",
        productId: "prod_4",
        productName: "Chicha morada 1L",
        sku: "CHI-001",
        quantity: 1,
        unitPrice: 8,
        discount: 0,
        subtotal: 8,
        igv: 1.44,
      },
    ],
    subtotal: 48,
    igv: 8.64,
    total: 56.64,
    currency: "PEN",
    issuedAt: "2026-09-22T10:20:00-05:00",
    paidAt: "2026-09-22T10:18:00-05:00",
    sessionId: "session_1",
    cashMovementId: "cash_move_2",
    createdAt: "2026-09-22T10:20:00-05:00",
  },
  {
    id: "inv_3",
    number: "F001-0006",
    type: "factura",
    status: "pagado",
    orderId: "ord_1050",
    orderNumber: "PED-1050",
    customer: {
      documentType: "ruc",
      documentNumber: "20598765432",
      name: "Distribuidora del Norte S.A.C.",
      tradeName: "DisNorte",
      address: "Av. Industrial 456, Trujillo",
      email: "ventas@disnorte.com",
    },
    items: [
      {
        id: "item_5",
        productId: "prod_5",
        productName: "Combo ejecutivo x10",
        sku: "COM-010",
        quantity: 10,
        unitPrice: 35,
        discount: 0,
        subtotal: 350,
        igv: 63,
      },
    ],
    subtotal: 350,
    igv: 63,
    total: 413,
    currency: "PEN",
    issuedAt: "2026-09-22T09:55:00-05:00",
    sentAt: "2026-09-22T09:56:00-05:00",
    paidAt: "2026-09-22T09:54:00-05:00",
    sessionId: "session_2",
    cashMovementId: "cash_move_3",
    createdAt: "2026-09-22T09:55:00-05:00",
  },
  {
    id: "inv_4",
    number: "B001-0014",
    type: "boleta",
    status: "emitido",
    orderId: "ord_1049",
    orderNumber: "PED-1049",
    customer: {
      documentType: "dni",
      documentNumber: "70456789",
      name: "Ana Martínez Ruiz",
    },
    items: [
      {
        id: "item_6",
        productId: "prod_6",
        productName: "Ceviche de pescado",
        sku: "CEV-001",
        quantity: 1,
        unitPrice: 38,
        discount: 0,
        subtotal: 38,
        igv: 6.84,
      },
    ],
    subtotal: 38,
    igv: 6.84,
    total: 44.84,
    currency: "PEN",
    issuedAt: "2026-09-22T11:10:00-05:00",
    createdAt: "2026-09-22T11:10:00-05:00",
  },
  {
    id: "inv_5",
    number: "B001-0011",
    type: "boleta",
    status: "anulado",
    orderId: "ord_1048",
    orderNumber: "PED-1048",
    customer: {
      documentType: "dni",
      documentNumber: "70111222",
      name: "Pedro Sánchez Díaz",
    },
    items: [
      {
        id: "item_7",
        productId: "prod_7",
        productName: "Arroz con mariscos",
        sku: "ARR-001",
        quantity: 2,
        unitPrice: 42,
        discount: 0,
        subtotal: 84,
        igv: 15.12,
      },
    ],
    subtotal: 84,
    igv: 15.12,
    total: 99.12,
    currency: "PEN",
    issuedAt: "2026-09-21T19:30:00-05:00",
    annulledAt: "2026-09-21T20:15:00-05:00",
    annulledReason: "Error en datos del cliente",
    createdAt: "2026-09-21T19:30:00-05:00",
  },
  {
    id: "inv_6",
    number: "F001-0007",
    type: "factura",
    status: "enviado",
    orderId: "ord_1047",
    orderNumber: "PED-1047",
    customer: {
      documentType: "ruc",
      documentNumber: "20654321098",
      name: "Minimarket Los Hermanos E.I.R.L.",
      tradeName: "Minimax",
      address: "Jr. Comercio 789, Lambayeque",
      email: "contabilidad@minimax.pe",
    },
    items: [
      {
        id: "item_8",
        productId: "prod_8",
        productName: "Cena para 20 personas",
        sku: "CEN-020",
        quantity: 1,
        unitPrice: 680,
        discount: 30,
        subtotal: 650,
        igv: 117,
      },
    ],
    subtotal: 650,
    igv: 117,
    total: 767,
    currency: "PEN",
    issuedAt: "2026-09-21T14:20:00-05:00",
    sentAt: "2026-09-21T14:25:00-05:00",
    createdAt: "2026-09-21T14:20:00-05:00",
  },
];

export const billingNotesMock: InvoiceNote[] = [
  {
    id: "note_1",
    number: "NC001-0002",
    type: "credito",
    reason: "devolucion",
    invoiceId: "inv_5",
    invoiceNumber: "B001-0011",
    amount: 99.12,
    notes: "Devolución completa por alergia del cliente",
    issuedAt: "2026-09-21T20:20:00-05:00",
    createdAt: "2026-09-21T20:20:00-05:00",
  },
  {
    id: "note_2",
    number: "ND001-0001",
    type: "debito",
    reason: "recargo",
    invoiceId: "inv_3",
    invoiceNumber: "F001-0006",
    amount: 25,
    notes: "Recargo por servicio de entrega urgente",
    issuedAt: "2026-09-22T10:00:00-05:00",
    createdAt: "2026-09-22T10:00:00-05:00",
  },
];

export const invoiceTypeLabel = (type: InvoiceType) =>
  ({ boleta: "Boleta", factura: "Factura" })[type];

export const invoiceStatusLabel = (status: InvoiceStatus) =>
  ({ emitido: "Emitido", enviado: "Enviado", pagado: "Pagado", anulado: "Anulado" })[status];

export const invoiceNoteTypeLabel = (type: InvoiceNoteType) =>
  ({ credito: "Nota de crédito", debito: "Nota de débito" })[type];

export const invoiceNoteReasonLabel = (reason: string) =>
  ({
    descuento: "Descuento",
    devolucion: "Devolución",
    anulacion: "Anulación",
    recargo: "Recargo",
    intereses: "Intereses",
    penalidades: "Penalidades",
  } as Record<string, string>)[reason] ?? reason;
