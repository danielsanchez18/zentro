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
import type { BusinessIndustry, CapabilityKey } from "@/types/dashboard";

export type IndustryCode = BusinessIndustry;
export type ModuleKey = CapabilityKey;

export interface Module {
  key: ModuleKey;
  label: string;
  descripcion: string;
  features: string[];
  icon: typeof Utensils;
}

export interface Rubro {
  code: IndustryCode;
  label: string;
  description: string;
  icon: LucideIcon;
  suggested: ModuleKey[];
  physicalSetupHelpful: boolean;
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
  {
    key: "ventas",
    label: "Ventas",
    descripcion: "POS, pedidos, pagos y caja",
    features: [
      "Punto de venta (POS) con facturación",
      "Pedidos para mesa, para llevar y delivery",
      "Múltiples métodos de pago",
      "Cierre de caja y control de turnos",
    ],
    icon: Wallet,
  },
  {
    key: "catalogo",
    label: "Catálogo",
    descripcion: "Productos y servicios",
    features: [
      "Productos con foto, precios y categorías",
      "Opción de incluir o no impuestos",
      "Control de precios por lista",
      "Servicios y planes recurrentes",
    ],
    icon: Package,
  },
  {
    key: "clientes",
    label: "Clientes",
    descripcion: "CRM, agenda y formularios",
    features: [
      "Base de datos de clientes con historial",
      "Agenda de citas y turnos",
      "Formularios para captar leads",
      "Notas y seguimiento de negociaciones",
    ],
    icon: Users,
  },
  {
    key: "inventario",
    label: "Inventario",
    descripcion: "Stock y compras",
    features: [
      "Stock por sucursal y alertas de bajo nivel",
      "Compras y órdenes a proveedores",
      "Transferencias entre sucursales",
      "Ajustes por mermas y devoluciones",
    ],
    icon: Boxes,
  },
  {
    key: "presencia",
    label: "Presencia digital",
    descripcion: "Web, blog y marketing",
    features: [
      "Constructor de tu página web",
      "Blog y contenido para SEO",
      "Campañas de marketing y coupons",
      "Perfiles de redes sociales",
    ],
    icon: Globe,
  },
  {
    key: "finanzas",
    label: "Finanzas",
    descripcion: "Gastos, facturación y reportes",
    features: [
      "Registro de gastos por categoría",
      "Facturación electrónica",
      "Reportes de ventas e ingresos",
      "Estado de cuentas y flujo de caja",
    ],
    icon: LineChart,
  },
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
    physicalSetupHelpful: true,
  },
  {
    code: "RETAIL",
    label: "Retail / Tienda",
    description: "Venta de productos físicos al por menor, con stock por controlar.",
    icon: ShoppingBag,
    suggested: ["ventas", "catalogo", "clientes", "inventario"],
    physicalSetupHelpful: true,
  },
  {
    code: "SERVICE",
    label: "Servicio profesional",
    description: "Consultorías, agencias o servicios por hora o por proyecto.",
    icon: Briefcase,
    suggested: ["clientes", "finanzas"],
    physicalSetupHelpful: false,
  },
  {
    code: "HEALTH",
    label: "Salud y bienestar",
    description: "Clínicas, spas o centros deportivos que atienden por turnos.",
    icon: HeartPulse,
    suggested: ["clientes", "ventas", "inventario"],
    physicalSetupHelpful: true,
  },
  {
    code: "OTHER",
    label: "Otro",
    description: "Un giro distinto. Adaptaremos los módulos a tu caso.",
    icon: Sparkles,
    suggested: ["catalogo", "clientes"],
    physicalSetupHelpful: false,
  },
];

export const RUBROS_BY_CODE = RUBROS.reduce<Record<IndustryCode, Rubro>>(
  (acc, r) => {
    acc[r.code] = r;
    return acc;
  },
  {} as Record<IndustryCode, Rubro>
);

export type StepId = "actividad" | "modulos" | "local" | "resumen";

export const STEPS: { id: StepId; label: string }[] = [
  { id: "actividad", label: "Actividad" },
  { id: "modulos", label: "Capacidades" },
  { id: "local", label: "Ubicación" },
  { id: "resumen", label: "Resumen" },
];
