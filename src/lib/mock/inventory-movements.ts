import { inventoryItems } from "./inventory";

export type InventoryMovementType = "entrada" | "salida" | "merma" | "ajuste";

export interface InventoryMovementRecord {
  id: string;
  itemId: string;
  productName: string;
  sku: string;
  type: InventoryMovementType;
  quantity: number;
  previousStock: number;
  resultingStock: number;
  reason: string;
  documentRef?: string;
  responsible: string;
  createdAt: string;
  notes?: string;
}

const reasons: Record<InventoryMovementType, string[]> = {
  entrada: ["Compra a proveedor", "Devolución de cliente"],
  salida: ["Salida manual", "Consumo interno"],
  merma: ["Producto deteriorado", "Producto vencido"],
  ajuste: ["Diferencia en conteo", "Regularización inicial"],
};

const types: InventoryMovementType[] = ["entrada", "salida", "entrada", "ajuste", "merma", "salida"];

export const inventoryMovements: InventoryMovementRecord[] = Array.from({ length: 28 }, (_, index) => {
  const item = inventoryItems[index % inventoryItems.length];
  const type = types[index % types.length];
  const magnitude = 2 + ((index * 3) % 17);
  const signedQuantity = type === "entrada" ? magnitude : type === "ajuste" ? (index % 2 ? -magnitude : magnitude) : -magnitude;
  const previousStock = Math.max(item.reservedStock, item.currentStock - signedQuantity);

  return {
    id: `mov_${String(index + 1).padStart(3, "0")}`,
    itemId: item.id,
    productName: item.productName,
    sku: item.sku,
    type,
    quantity: signedQuantity,
    previousStock,
    resultingStock: Math.max(item.reservedStock, previousStock + signedQuantity),
    reason: reasons[type][index % reasons[type].length],
    documentRef: type === "entrada" ? `F001-${String(248 + index).padStart(5, "0")}` : undefined,
    responsible: ["María Quispe", "Diego Salazar", "Lucía Torres"][index % 3],
    createdAt: new Date(2026, 7, 31 - (index % 14), 9 + (index % 8), (index * 7) % 60).toISOString(),
    notes: index % 4 === 0 ? "Movimiento verificado durante el control de existencias." : undefined,
  };
});

