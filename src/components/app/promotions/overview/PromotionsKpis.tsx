import { CalendarClock, CircleAlert, Gift, Tags } from "lucide-react";
import type { Promotion } from "@/lib/mock/promotions";

const PROTOTYPE_NOW = Date.parse("2026-09-04T12:00:00-05:00");

export function PromotionsKpis({ promotions }: { promotions: Promotion[] }) {
  const endingSoon = promotions.filter((promotion) => promotion.status === "activa" && Date.parse(promotion.endsAt) - PROTOTYPE_NOW <= 7 * 86400000).length;
  const stats = [{ title: "Promociones activas", value: promotions.filter((item) => item.status === "activa").length, suffix: "promociones", subtitle: "Aplicándose actualmente", icon: Gift }, { title: "Programadas", value: promotions.filter((item) => item.status === "programada").length, suffix: "promociones", subtitle: "Comenzarán próximamente", icon: CalendarClock }, { title: "Por finalizar", value: endingSoon, suffix: "promociones", subtitle: "Terminan en siete días", icon: CircleAlert }, { title: "Productos afectados", value: promotions.filter((item) => ["activa", "programada"].includes(item.status)).reduce((sum, item) => sum + item.affectedProducts, 0), suffix: "productos", subtitle: "Activos o programados", icon: Tags }];
  return <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map((item) => <article key={item.title} className="rounded-xl border border-border bg-card px-5 py-4 font-heading"><div className="flex items-center justify-between text-primary/70"><p className="text-sm">{item.title}</p><item.icon className="size-4.5" /></div><p className="mt-2 text-xl font-medium">{item.value.toLocaleString("es-PE")} <span className="text-sm">{item.suffix}</span></p><p className="mt-1 text-xs text-primary/70">{item.subtitle}</p></article>)}</section>;
}
