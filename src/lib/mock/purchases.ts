export type PurchaseStatus = "borrador" | "enviada" | "parcial" | "recibida" | "cancelada";
export type PurchasePaymentStatus = "pendiente" | "parcial" | "pagado";

export interface PurchaseLine {
  id: string;
  inventoryItemId: string;
  productName: string;
  sku: string;
  quantity: number;
  receivedQuantity: number;
  unitCost: number;
}

export interface PurchaseOrder {
  id: string;
  number: string;
  supplierId: string;
  supplierName: string;
  issuedAt: string;
  expectedAt: string;
  itemCount: number;
  orderedUnits: number;
  receivedUnits: number;
  total: number;
  currency: "PEN";
  status: PurchaseStatus;
  paymentStatus: PurchasePaymentStatus;
  reference?: string;
  paymentTerms?: string;
  notes?: string;
  lines: PurchaseLine[];
}

const purchaseOrderSummaries: Omit<PurchaseOrder, "lines">[] = [
  { id: "pur_1", number: "OC-2026-0081", supplierId: "sup_1", supplierName: "Andina Foods", issuedAt: "2026-09-02T14:20:00.000Z", expectedAt: "2026-09-05T15:00:00.000Z", itemCount: 6, orderedUnits: 84, receivedUnits: 0, total: 4280, currency: "PEN", status: "enviada", paymentStatus: "pendiente", reference: "COT-1842" },
  { id: "pur_2", number: "OC-2026-0080", supplierId: "sup_3", supplierName: "Santa Rosa", issuedAt: "2026-09-01T10:15:00.000Z", expectedAt: "2026-09-03T16:00:00.000Z", itemCount: 4, orderedUnits: 60, receivedUnits: 36, total: 2190, currency: "PEN", status: "parcial", paymentStatus: "parcial", reference: "F001-8821" },
  { id: "pur_3", number: "OC-2026-0079", supplierId: "sup_5", supplierName: "El Huerto", issuedAt: "2026-08-30T08:40:00.000Z", expectedAt: "2026-08-31T09:00:00.000Z", itemCount: 8, orderedUnits: 126, receivedUnits: 126, total: 1875.5, currency: "PEN", status: "recibida", paymentStatus: "pagado", reference: "F004-0318" },
  { id: "pur_4", number: "OC-2026-0078", supplierId: "sup_7", supplierName: "Carnes Selectas", issuedAt: "2026-08-29T17:10:00.000Z", expectedAt: "2026-09-02T12:00:00.000Z", itemCount: 3, orderedUnits: 45, receivedUnits: 0, total: 3640, currency: "PEN", status: "enviada", paymentStatus: "pendiente" },
  { id: "pur_5", number: "OC-2026-0077", supplierId: "sup_2", supplierName: "Pacífico", issuedAt: "2026-08-27T12:00:00.000Z", expectedAt: "2026-08-30T12:00:00.000Z", itemCount: 5, orderedUnits: 72, receivedUnits: 72, total: 2950, currency: "PEN", status: "recibida", paymentStatus: "pagado", reference: "F102-5540" },
  { id: "pur_6", number: "OC-2026-0076", supplierId: "sup_4", supplierName: "Pack Lima", issuedAt: "2026-08-26T09:30:00.000Z", expectedAt: "2026-09-04T18:00:00.000Z", itemCount: 7, orderedUnits: 500, receivedUnits: 0, total: 1250, currency: "PEN", status: "borrador", paymentStatus: "pendiente" },
  { id: "pur_7", number: "OC-2026-0075", supplierId: "sup_1", supplierName: "Andina Foods", issuedAt: "2026-08-24T15:45:00.000Z", expectedAt: "2026-08-27T15:00:00.000Z", itemCount: 2, orderedUnits: 24, receivedUnits: 0, total: 890, currency: "PEN", status: "cancelada", paymentStatus: "pendiente" },
  { id: "pur_8", number: "OC-2026-0074", supplierId: "sup_5", supplierName: "El Huerto", issuedAt: "2026-08-22T07:20:00.000Z", expectedAt: "2026-08-23T08:00:00.000Z", itemCount: 9, orderedUnits: 142, receivedUnits: 142, total: 2035, currency: "PEN", status: "recibida", paymentStatus: "pagado", reference: "F004-0301" },
];

const productSeeds = [
  ["inv_1", "Jugo de Naranja", "PROD_1"],
  ["inv_3", "Coca-Cola", "PROD_3"],
  ["inv_7", "Helado de Vainilla", "PROD_7"],
  ["inv_11", "Pizza Margarita", "PROD_11"],
  ["inv_15", "Papas Fritas", "PROD_15"],
] as const;

export const purchaseOrders: PurchaseOrder[] = purchaseOrderSummaries.map((order, orderIndex) => {
  const lineCount = Math.min(3, order.itemCount);
  let assigned = 0;
  let receivedAssigned = 0;
  const lines = Array.from({ length: lineCount }, (_, lineIndex) => {
    const seed = productSeeds[(orderIndex + lineIndex) % productSeeds.length];
    const quantity = lineIndex === lineCount - 1 ? order.orderedUnits - assigned : Math.floor(order.orderedUnits / lineCount);
    const receivedQuantity = lineIndex === lineCount - 1 ? order.receivedUnits - receivedAssigned : Math.min(quantity, Math.floor(order.receivedUnits / lineCount));
    assigned += quantity;
    receivedAssigned += receivedQuantity;
    return { id: `${order.id}_line_${lineIndex + 1}`, inventoryItemId: seed[0], productName: seed[1], sku: seed[2], quantity, receivedQuantity, unitCost: Number((order.total / order.orderedUnits).toFixed(2)) };
  });
  return { ...order, paymentTerms: "Crédito a 30 días", notes: "", lines };
});

export const formatPurchaseMoney = (value: number) => new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(value);
export const purchaseProgress = (order: PurchaseOrder) => order.orderedUnits ? Math.round((order.receivedUnits / order.orderedUnits) * 100) : 0;
export const purchaseTotal = (lines: PurchaseLine[]) => lines.reduce((sum, line) => sum + line.quantity * line.unitCost, 0);
