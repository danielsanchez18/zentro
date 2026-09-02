import { catalogProducts } from "./catalog";

export type InventoryStatus = "disponible" | "bajo" | "agotado";

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  brand: string;
  supplier: string;
  categoryId: string;
  currentStock: number;
  reservedStock: number;
  minimumStock: number;
  unitCost: number;
  updatedAt: string;
}

const brands = ["Zentro Kitchen", "Costa Norte", "La Huerta", "Casa Dulce"];
const suppliers = ["Distribuidora Las Rocas", "Mercado Central", "Alimentos Andinos"];
const stockLevels = [42, 8, 0, 27, 5, 64, 13, 2, 31, 0, 18, 7, 24, 4, 56, 11, 3, 20];

export const inventoryItems: InventoryItem[] = catalogProducts.map((product, index) => ({
  id: `inv_${index + 1}`,
  productId: product.id,
  productName: product.name,
  sku: product.id.toUpperCase(),
  brand: brands[index % brands.length],
  supplier: suppliers[index % suppliers.length],
  categoryId: product.categoryId,
  currentStock: stockLevels[index] ?? 0,
  reservedStock: index % 4,
  minimumStock: index % 3 === 0 ? 10 : 6,
  unitCost: Math.round(product.basePrice * 0.58),
  updatedAt: new Date(2026, 7, 28 - (index % 5), 9 + (index % 8), 15).toISOString(),
}));

export const availableStock = (item: InventoryItem) =>
  Math.max(0, item.currentStock - item.reservedStock);

export const inventoryStatus = (item: InventoryItem): InventoryStatus => {
  const available = availableStock(item);
  if (available === 0) return "agotado";
  if (available <= item.minimumStock) return "bajo";
  return "disponible";
};
