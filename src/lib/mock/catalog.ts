/**
 * Datos mock del módulo Catálogo.
 *
 * Fuente temporal mientras no exista la API REST. La estructura replica lo que
 * devolverá el backend para que al conectar solo se cambie el origen.
 */

// ─── Categorías ────────────────────────────────────────────────────────────

export interface CatalogCategory {
  id: string;
  name: string;
  slug: string;
  parentId: null;
  description: string;
  status: "activo" | "inactivo";
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CatalogSubcategory {
  id: string;
  name: string;
  slug: string;
  parentId: string;
  description: string;
  status: "activo" | "inactivo";
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export type CatalogCategoryEntry = CatalogCategory | CatalogSubcategory;

export const catalogCategories: CatalogCategory[] = [
  { id: "cat_1", name: "Bebidas", slug: "bebidas", parentId: null, description: "Bebidas frías y calientes preparadas para acompañar cada pedido.", status: "activo", createdAt: "2026-07-18T15:40:00.000Z", updatedAt: "2026-08-12T18:20:00.000Z" },
  { id: "cat_2", name: "Postres", slug: "postres", parentId: null, description: "Selección de postres y porciones dulces de la casa.", status: "activo", createdAt: "2026-07-18T15:45:00.000Z", updatedAt: "2026-08-10T16:10:00.000Z" },
  { id: "cat_3", name: "Platos", slug: "platos", parentId: null, description: "Platos principales disponibles durante el servicio.", status: "activo", createdAt: "2026-07-19T13:20:00.000Z", updatedAt: "2026-08-14T20:05:00.000Z" },
  { id: "cat_4", name: "Entradas", slug: "entradas", parentId: null, description: "Opciones ligeras para compartir o comenzar el pedido.", status: "activo", createdAt: "2026-07-20T11:10:00.000Z", updatedAt: "2026-08-09T14:30:00.000Z" },
  { id: "cat_5", name: "Combos", slug: "combos", parentId: null, description: "Combinaciones de productos con precio especial.", status: "inactivo", createdAt: "2026-07-22T17:00:00.000Z", updatedAt: "2026-08-15T12:45:00.000Z" },
];

export const catalogSubcategories: CatalogSubcategory[] = [
  { id: "sub_1", name: "Jugos", slug: "jugos", parentId: "cat_1", description: "Jugos naturales preparados al momento.", status: "activo", createdAt: "2026-07-18T16:00:00.000Z", updatedAt: "2026-08-12T18:20:00.000Z" },
  { id: "sub_2", name: "Gaseosas", slug: "gaseosas", parentId: "cat_1", description: "Bebidas gaseosas en distintas presentaciones.", status: "activo", createdAt: "2026-07-18T16:05:00.000Z", updatedAt: "2026-08-11T12:10:00.000Z" },
  { id: "sub_3", name: "Cafés", slug: "cafes", parentId: "cat_1", description: "Cafés calientes preparados para cada pedido.", status: "activo", createdAt: "2026-07-18T16:10:00.000Z", updatedAt: "2026-08-13T09:25:00.000Z" },
  { id: "sub_4", name: "Helados", slug: "helados", parentId: "cat_2", description: "Helados por porción en sabores seleccionados.", status: "activo", createdAt: "2026-07-19T10:00:00.000Z", updatedAt: "2026-08-10T16:10:00.000Z" },
  { id: "sub_5", name: "Tortas", slug: "tortas", parentId: "cat_2", description: "Porciones de tortas elaboradas en la casa.", status: "activo", createdAt: "2026-07-19T10:05:00.000Z", updatedAt: "2026-08-14T15:40:00.000Z" },
];

// ─── Productos ──────────────────────────────────────────────────────────────

export interface ProductVariant {
  id: string;
  label: string;
  priceOverride?: number;
  status: "activo" | "inactivo";
}

export interface CatalogProduct {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  subcategoryId?: string;
  basePrice: number;
  status: "activo" | "inactivo";
  image?: string;
  variants?: ProductVariant[];
}

export const catalogProducts: CatalogProduct[] = [
  {
    id: "prod_1",
    name: "Jugo de Naranja",
    description: "Jugo natural recién exprimido",
    categoryId: "cat_1",
    subcategoryId: "sub_1",
    basePrice: 2500,
    status: "activo",
    variants: [
      { id: "var_1a", label: "300ml", priceOverride: 2500, status: "activo" },
      { id: "var_1b", label: "500ml", priceOverride: 3500, status: "activo" },
    ],
  },
  {
    id: "prod_2",
    name: "Jugo de Limón",
    description: "Jugo natural con hielo",
    categoryId: "cat_1",
    subcategoryId: "sub_1",
    basePrice: 2200,
    status: "activo",
    variants: [
      { id: "var_2a", label: "300ml", priceOverride: 2200, status: "activo" },
      { id: "var_2b", label: "500ml", priceOverride: 3200, status: "activo" },
    ],
  },
  {
    id: "prod_3",
    name: "Coca-Cola",
    description: "Gaseosa 350ml",
    categoryId: "cat_1",
    subcategoryId: "sub_2",
    basePrice: 1800,
    status: "activo",
  },
  {
    id: "prod_4",
    name: "Sprite",
    description: "Gaseosa 350ml",
    categoryId: "cat_1",
    subcategoryId: "sub_2",
    basePrice: 1800,
    status: "activo",
  },
  {
    id: "prod_5",
    name: "Café Americano",
    description: "Café filtrado 250ml",
    categoryId: "cat_1",
    subcategoryId: "sub_3",
    basePrice: 1500,
    status: "activo",
  },
  {
    id: "prod_6",
    name: "Cappuccino",
    description: "Café con espuma de leche",
    categoryId: "cat_1",
    subcategoryId: "sub_3",
    basePrice: 2800,
    status: "activo",
    variants: [
      { id: "var_6a", label: "Regular", priceOverride: 2800, status: "activo" },
      { id: "var_6b", label: "Grande", priceOverride: 3500, status: "activo" },
    ],
  },
  {
    id: "prod_7",
    name: "Helado de Vainilla",
    description: "Porción individual",
    categoryId: "cat_2",
    subcategoryId: "sub_4",
    basePrice: 2200,
    status: "activo",
  },
  {
    id: "prod_8",
    name: "Helado de Chocolate",
    description: "Porción individual",
    categoryId: "cat_2",
    subcategoryId: "sub_4",
    basePrice: 2200,
    status: "activo",
  },
  {
    id: "prod_9",
    name: "Torta de Chocolate",
    description: "Porción generosa de torta húmeda",
    categoryId: "cat_2",
    subcategoryId: "sub_5",
    basePrice: 4500,
    status: "activo",
  },
  {
    id: "prod_10",
    name: "Torta de Zanahoria",
    description: "Con frosting de queso crema",
    categoryId: "cat_2",
    subcategoryId: "sub_5",
    basePrice: 4200,
    status: "inactivo",
  },
  {
    id: "prod_11",
    name: "Pizza Margarita",
    description: "Mozzarella, tomate y albahaca",
    categoryId: "cat_3",
    basePrice: 8500,
    status: "activo",
    variants: [
      { id: "var_11a", label: "Individual", priceOverride: 8500, status: "activo" },
      { id: "var_11b", label: "Mediana", priceOverride: 12000, status: "activo" },
      { id: "var_11c", label: "Familiar", priceOverride: 16000, status: "activo" },
    ],
  },
  {
    id: "prod_12",
    name: "Pizza Pepperoni",
    description: "Con extra pepperoni",
    categoryId: "cat_3",
    basePrice: 9500,
    status: "activo",
    variants: [
      { id: "var_12a", label: "Individual", priceOverride: 9500, status: "activo" },
      { id: "var_12b", label: "Mediana", priceOverride: 13000, status: "activo" },
    ],
  },
  {
    id: "prod_13",
    name: "Ensalada César",
    description: "Lechuga, pollo, crutones, parmesano",
    categoryId: "cat_3",
    basePrice: 6500,
    status: "activo",
  },
  {
    id: "prod_14",
    name: "Pasta Alfredo",
    description: "Fettuccine con salsa cremosa",
    categoryId: "cat_3",
    basePrice: 7200,
    status: "activo",
  },
  {
    id: "prod_15",
    name: "Papas Fritas",
    description: "Porción individual",
    categoryId: "cat_4",
    basePrice: 3200,
    status: "activo",
  },
  {
    id: "prod_16",
    name: "Nachos",
    description: "Con queso y jalapeños",
    categoryId: "cat_4",
    basePrice: 4500,
    status: "activo",
  },
  {
    id: "prod_17",
    name: "Combo Almuerzo",
    description: "Plato + bebida + postre",
    categoryId: "cat_5",
    basePrice: 12900,
    status: "activo",
  },
  {
    id: "prod_18",
    name: "Combo Pareja",
    description: "2 platos + 2 bebidas + postre compartido",
    categoryId: "cat_5",
    basePrice: 22900,
    status: "inactivo",
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Nombre de categoría por ID. */
export const categoryName = (id: string): string =>
  catalogCategories.find((c) => c.id === id)?.name ?? "Sin categoría";

/** Nombre de subcategoría por ID. */
export const subcategoryName = (id: string): string =>
  catalogSubcategories.find((s) => s.id === id)?.name ?? "";

/** Subcategorías de una categoría. */
export const subcategoriesOf = (categoryId: string): CatalogSubcategory[] =>
  catalogSubcategories.filter((s) => s.parentId === categoryId);
