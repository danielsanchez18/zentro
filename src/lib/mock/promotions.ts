export type PromotionStatus = "borrador" | "programada" | "activa" | "pausada" | "finalizada" | "cancelada";
export type PromotionType = "porcentaje" | "monto_fijo" | "precio_fijo";
export type PromotionScope = "productos" | "categorias";

export interface Promotion {
  id: string;
  code: string;
  name: string;
  description: string;
  type: PromotionType;
  value: number;
  scope: PromotionScope;
  targetNames: string[];
  affectedProducts: number;
  startsAt: string;
  endsAt: string;
  priority: number;
  usageCount: number;
  usageLimit: number | null;
  status: PromotionStatus;
  createdAt: string;
}

export const promotions: Promotion[] = [
  { id: "promo_1", code: "PR-2026-018", name: "Bebidas de primavera", description: "Descuento temporal en bebidas frías seleccionadas.", type: "porcentaje", value: 20, scope: "categorias", targetNames: ["Bebidas"], affectedProducts: 6, startsAt: "2026-09-01T05:00:00.000Z", endsAt: "2026-09-15T04:59:59.000Z", priority: 10, usageCount: 84, usageLimit: 200, status: "activa", createdAt: "2026-08-24T15:30:00.000Z" },
  { id: "promo_2", code: "PR-2026-017", name: "Postres del fin de semana", description: "Precio especial en porciones dulces de la casa.", type: "precio_fijo", value: 18, scope: "productos", targetNames: ["Torta de Chocolate", "Torta de Zanahoria"], affectedProducts: 2, startsAt: "2026-09-05T05:00:00.000Z", endsAt: "2026-09-08T04:59:59.000Z", priority: 20, usageCount: 0, usageLimit: 80, status: "programada", createdAt: "2026-08-29T18:15:00.000Z" },
  { id: "promo_3", code: "PR-2026-016", name: "S/ 10 menos en pizzas", description: "Beneficio fijo sobre pizzas medianas y familiares.", type: "monto_fijo", value: 10, scope: "productos", targetNames: ["Pizza Margarita", "Pizza Pepperoni"], affectedProducts: 2, startsAt: "2026-08-28T05:00:00.000Z", endsAt: "2026-09-10T04:59:59.000Z", priority: 30, usageCount: 31, usageLimit: 50, status: "pausada", createdAt: "2026-08-20T12:00:00.000Z" },
  { id: "promo_4", code: "PR-2026-015", name: "Entradas para compartir", description: "Descuento en toda la categoría de entradas.", type: "porcentaje", value: 15, scope: "categorias", targetNames: ["Entradas"], affectedProducts: 4, startsAt: "2026-09-12T05:00:00.000Z", endsAt: "2026-09-30T04:59:59.000Z", priority: 15, usageCount: 0, usageLimit: null, status: "borrador", createdAt: "2026-09-02T16:45:00.000Z" },
  { id: "promo_5", code: "PR-2026-014", name: "Almuerzos de agosto", description: "Campaña finalizada para platos principales.", type: "porcentaje", value: 12, scope: "categorias", targetNames: ["Platos"], affectedProducts: 7, startsAt: "2026-08-01T05:00:00.000Z", endsAt: "2026-08-31T04:59:59.000Z", priority: 8, usageCount: 142, usageLimit: 250, status: "finalizada", createdAt: "2026-07-25T14:10:00.000Z" },
  { id: "promo_6", code: "PR-2026-013", name: "Precio especial Coca-Cola", description: "Promoción cancelada antes de su publicación.", type: "precio_fijo", value: 5.9, scope: "productos", targetNames: ["Coca-Cola"], affectedProducts: 1, startsAt: "2026-09-01T05:00:00.000Z", endsAt: "2026-09-20T04:59:59.000Z", priority: 5, usageCount: 0, usageLimit: 100, status: "cancelada", createdAt: "2026-08-18T09:20:00.000Z" },
  { id: "promo_7", code: "PR-2026-012", name: "Helados seleccionados", description: "Descuento en sabores disponibles durante septiembre.", type: "porcentaje", value: 18, scope: "productos", targetNames: ["Helado de Vainilla", "Helado de Chocolate"], affectedProducts: 2, startsAt: "2026-09-03T05:00:00.000Z", endsAt: "2026-09-18T04:59:59.000Z", priority: 18, usageCount: 26, usageLimit: null, status: "activa", createdAt: "2026-08-30T11:05:00.000Z" },
];

export const promotionBenefit = (promotion: Promotion) => promotion.type === "porcentaje" ? `${promotion.value}% de descuento` : promotion.type === "monto_fijo" ? `S/ ${promotion.value.toFixed(2)} de descuento` : `Precio S/ ${promotion.value.toFixed(2)}`;
export const promotionTypeLabel = (type: PromotionType) => type === "porcentaje" ? "Porcentaje" : type === "monto_fijo" ? "Monto fijo" : "Precio promocional";
export const promotionUsageLabel = (promotion: Promotion) =>
  promotion.usageLimit === null
    ? `${promotion.usageCount} usos · Ilimitado`
    : `${promotion.usageCount} de ${promotion.usageLimit} usos`;
export const promotionUsageProgress = (promotion: Promotion) =>
  promotion.usageLimit === null || promotion.usageLimit === 0
    ? null
    : Math.min((promotion.usageCount / promotion.usageLimit) * 100, 100);
