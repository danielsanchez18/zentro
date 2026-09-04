export type InventoryBrandStatus = "activo" | "inactivo";

export interface InventoryBrand {
  id: string;
  name: string;
  description: string;
  status: InventoryBrandStatus;
  origin: string;
  productCount: number;
  unitsInStock: number;
  inventoryValue: number;
  updatedAt: string;
}

export const inventoryBrands: InventoryBrand[] = [
  { id: "brand_1", name: "Zentro Kitchen", description: "Línea propia de productos preparados y especialidades de la casa.", status: "activo", origin: "Perú", productCount: 14, unitsInStock: 186, inventoryValue: 7420, updatedAt: "2026-09-01T14:30:00.000Z" },
  { id: "brand_2", name: "Costa Norte", description: "Bebidas, salsas y productos seleccionados de la costa peruana.", status: "activo", origin: "Perú", productCount: 9, unitsInStock: 94, inventoryValue: 3860, updatedAt: "2026-08-30T10:15:00.000Z" },
  { id: "brand_3", name: "La Huerta", description: "Vegetales, frutas e insumos frescos para preparación diaria.", status: "activo", origin: "Perú", productCount: 11, unitsInStock: 132, inventoryValue: 2490, updatedAt: "2026-09-02T08:20:00.000Z" },
  { id: "brand_4", name: "Casa Dulce", description: "Postres, coberturas e ingredientes para repostería.", status: "activo", origin: "Perú", productCount: 7, unitsInStock: 68, inventoryValue: 3180, updatedAt: "2026-08-28T16:45:00.000Z" },
  { id: "brand_5", name: "Andes Select", description: "Granos, especias y productos de origen andino.", status: "activo", origin: "Perú", productCount: 8, unitsInStock: 76, inventoryValue: 2910, updatedAt: "2026-08-26T12:10:00.000Z" },
  { id: "brand_6", name: "Nova Food Service", description: "Insumos importados para cocina profesional.", status: "inactivo", origin: "Estados Unidos", productCount: 5, unitsInStock: 21, inventoryValue: 1750, updatedAt: "2026-06-18T09:40:00.000Z" },
  { id: "brand_7", name: "Valle Verde", description: "Productos orgánicos y alternativas de origen vegetal.", status: "activo", origin: "Perú", productCount: 6, unitsInStock: 54, inventoryValue: 2240, updatedAt: "2026-08-25T11:35:00.000Z" },
  { id: "brand_8", name: "Metro Pack", description: "Empaques y consumibles para despacho y delivery.", status: "inactivo", origin: "China", productCount: 4, unitsInStock: 120, inventoryValue: 980, updatedAt: "2026-05-12T15:00:00.000Z" },
];
