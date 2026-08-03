import {
  Briefcase,
  HeartPulse,
  ShoppingBag,
  Sparkles,
  Utensils,
  Wallet,
  Package,
  Users,
  Boxes,
  Globe,
  LineChart,
  type LucideIcon,
} from "lucide-react";

export type IndustryCode = "RESTAURANT" | "RETAIL" | "SERVICE" | "HEALTH" | "OTHER";

export type ModuleKey =
  | "ventas"
  | "catalogo"
  | "clientes"
  | "inventario"
  | "presencia"
  | "finanzas";

export interface Module {
  key: ModuleKey;
  label: string;
  descripcion: string;
  icon: typeof Utensils;
}

export interface Rubro {
  code: IndustryCode;
  label: string;
  description: string;
  icon: LucideIcon;
  suggested: ModuleKey[];
  indispensable: ModuleKey[];
}

export interface LocalData {
  nombre: string;
  direccion: string;
  telefono: string;
  horario: string;
}

/**
 * Módulos disponibles (agrupación top-level, ver docs/planning/user-dashboard-data-model.md).
 */
export const MODULES: Module[] = [
  { key: "ventas", label: "Ventas", descripcion: "POS, pedidos, pagos, caja", icon: Wallet },
  { key: "catalogo", label: "Catálogo", descripcion: "Productos y servicios", icon: Package },
  { key: "clientes", label: "Clientes", descripcion: "CRM, agenda, formularios", icon: Users },
  { key: "inventario", label: "Inventario", descripcion: "Stock y compras", icon: Boxes },
  { key: "presencia", label: "Presencia digital", descripcion: "Web, blog, marketing", icon: Globe },
  { key: "finanzas", label: "Finanzas", descripcion: "Gastos, facturación, reportes", icon: LineChart },
];

export const MODULE_MAP = MODULES.reduce<Record<ModuleKey, Module>>(
  (acc, m) => {
    acc[m.key] = m;
    return acc;
  },
  {} as Record<ModuleKey, Module>
);

export const EMPTY_MODULES: Record<ModuleKey, boolean> = {
  ventas: false,
  catalogo: false,
  clientes: false,
  inventario: false,
  presencia: false,
  finanzas: false,
};

/**
 * Mapeo rubro → módulos (docs/planning/user-dashboard-requirements.md, "Catálogo de rubros").
 * Agenda/Pagos viven dentro de Clientes/Ventas, se mapean a su módulo top-level.
 */
export const RUBROS: Rubro[] = [
  {
    code: "RESTAURANT",
    label: "Restaurante / Café / Bar",
    description: "Negocio de comidas y bebidas para servir en el local o para llevar.",
    icon: Utensils,
    suggested: ["ventas", "catalogo", "clientes"],
    indispensable: ["ventas"],
  },
  {
    code: "RETAIL",
    label: "Retail / Tienda",
    description: "Venta de productos físicos al por menor, con stock por controlar.",
    icon: ShoppingBag,
    suggested: ["ventas", "catalogo", "clientes", "inventario"],
    indispensable: ["ventas", "inventario"],
  },
  {
    code: "SERVICE",
    label: "Servicio profesional",
    description: "Consultorías, agencias o servicios por hora o por proyecto.",
    icon: Briefcase,
    suggested: ["clientes", "finanzas"],
    indispensable: ["clientes"],
  },
  {
    code: "HEALTH",
    label: "Salud y bienestar",
    description: "Clínicas, spas o centros deportivos que atienden por turnos.",
    icon: HeartPulse,
    suggested: ["clientes", "ventas", "inventario"],
    indispensable: ["clientes", "ventas"],
  },
  {
    code: "OTHER",
    label: "Otro",
    description: "Un giro distinto. Adaptaremos los módulos a tu caso.",
    icon: Sparkles,
    suggested: ["catalogo", "clientes"],
    indispensable: [],
  },
];

export const RUBROS_BY_CODE = RUBROS.reduce<Record<IndustryCode, Rubro>>(
  (acc, r) => {
    acc[r.code] = r;
    return acc;
  },
  {} as Record<IndustryCode, Rubro>
);

export type StepId = "actividad" | "local" | "modulos";

export const STEPS: { id: StepId; label: string }[] = [
  { id: "actividad", label: "Actividad" },
  { id: "local", label: "Tu local" },
  { id: "modulos", label: "Módulos" },
];