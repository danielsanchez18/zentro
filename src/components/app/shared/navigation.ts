import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  ShoppingCart,
  ClipboardList,
  Package,
  CreditCard,
  Wallet,
  Percent,
  Tags,
  Boxes,
  Truck,
  Ship,
  Users,
  CalendarDays,
  FileText,
  Globe,
  Newspaper,
  Megaphone,
  Receipt,
  ReceiptText,
  Building2,
  Store,
  UserRound,
  ShieldCheck,
  Bell,
  Plug,
  History,
  ShoppingBag,
} from "lucide-react";

/**
 * Configuración de navegación del Tenant Dashboard (/app/:slug).
 * Estructura alineada con la documentación de Notion (Módulos + Capacidades)
 * y con el ADR-010 (ámbitos Tenant vs Branch).
 */
export interface TenantNavItem {
  key: string;
  label: string;
  href: (slug: string) => string;
  icon: LucideIcon;
}

export interface TenantNavSection {
  title?: string;
  /** Ámbito de la sección según ADR-010 (branch operativo vs tenant global). */
  scope?: "branch" | "tenant";
  items: TenantNavItem[];
}

export const APP_NAV: TenantNavSection[] = [
  {
    title: "Inicio",
    items: [
      {
        key: "overview",
        label: "Resumen general",
        href: (slug) => `/app/${slug}`,
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Ventas",
    scope: "branch",
    items: [
      {
        key: "catalogo",
        label: "Catálogo",
        href: (slug) => `/app/${slug}/catalogo`,
        icon: Package,
      },
      {
        key: "pos",
        label: "Punto de venta",
        href: (slug) => `/app/${slug}/pos`,
        icon: ShoppingCart,
      },
      {
        key: "pedidos",
        label: "Pedidos",
        href: (slug) => `/app/${slug}/pedidos`,
        icon: ClipboardList,
      },
      {
        key: "pagos",
        label: "Pagos",
        href: (slug) => `/app/${slug}/pagos`,
        icon: CreditCard,
      },
      {
        key: "caja",
        label: "Caja",
        href: (slug) => `/app/${slug}/caja`,
        icon: Wallet,
      },
      {
        key: "promociones",
        label: "Promociones",
        href: (slug) => `/app/${slug}/promociones`,
        icon: Percent,
      },
      {
        key: "precios",
        label: "Control de precios",
        href: (slug) => `/app/${slug}/precios`,
        icon: Tags,
      },
    ],
  },
  {
    title: "Operaciones",
    scope: "branch",
    items: [
      {
        key: "inventario",
        label: "Inventario",
        href: (slug) => `/app/${slug}/inventario`,
        icon: Boxes,
      },
      {
        key: "compras",
        label: "Compras",
        href: (slug) => `/app/${slug}/compras`,
        icon: Truck,
      },
      {
        key: "envios",
        label: "Envíos",
        href: (slug) => `/app/${slug}/envios`,
        icon: Ship,
      },
    ],
  },
  {
    title: "Clientes",
    scope: "branch",
    items: [
      {
        key: "clientes",
        label: "Clientes / CRM",
        href: (slug) => `/app/${slug}/clientes`,
        icon: Users,
      },
      {
        key: "agenda",
        label: "Agenda",
        href: (slug) => `/app/${slug}/agenda`,
        icon: CalendarDays,
      },
      {
        key: "formularios",
        label: "Formularios",
        href: (slug) => `/app/${slug}/formularios`,
        icon: FileText,
      },
    ],
  },
  {
    title: "Presencia digital",
    scope: "tenant",
    items: [
      {
        key: "presencia",
        label: "Constructor web",
        href: (slug) => `/app/${slug}/presencia`,
        icon: Globe,
      },
      {
        key: "blog",
        label: "Blog",
        href: (slug) => `/app/${slug}/blog`,
        icon: Newspaper,
      },
      {
        key: "marketing",
        label: "Marketing",
        href: (slug) => `/app/${slug}/marketing`,
        icon: Megaphone,
      },
    ],
  },
  {
    title: "Finanzas",
    scope: "tenant",
    items: [
      {
        key: "gastos",
        label: "Gastos",
        href: (slug) => `/app/${slug}/gastos`,
        icon: Receipt,
      },
      {
        key: "facturacion",
        label: "Facturación",
        href: (slug) => `/app/${slug}/facturacion`,
        icon: ReceiptText,
      },
      {
        key: "reportes",
        label: "Reportes",
        href: (slug) => `/app/${slug}/reportes`,
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Configuración",
    scope: "tenant",
    items: [
      {
        key: "organizacion",
        label: "Organización",
        href: (slug) => `/app/${slug}/organizacion`,
        icon: Building2,
      },
      {
        key: "sucursales",
        label: "Sucursales",
        href: (slug) => `/app/${slug}/sucursales`,
        icon: Store,
      },
      {
        key: "usuarios",
        label: "Usuarios",
        href: (slug) => `/app/${slug}/usuarios`,
        icon: UserRound,
      },
      {
        key: "roles",
        label: "Roles",
        href: (slug) => `/app/${slug}/roles`,
        icon: ShieldCheck,
      },
      {
        key: "notificaciones",
        label: "Notificaciones",
        href: (slug) => `/app/${slug}/notificaciones`,
        icon: Bell,
      },
      {
        key: "integraciones",
        label: "Integraciones / API",
        href: (slug) => `/app/${slug}/integraciones`,
        icon: Plug,
      },
      {
        key: "auditoria",
        label: "Auditoría",
        href: (slug) => `/app/${slug}/auditoria`,
        icon: History,
      },
      {
        key: "marketplace",
        label: "Marketplace",
        href: (slug) => `/app/${slug}/marketplace`,
        icon: ShoppingBag,
      },
      {
        key: "plan",
        label: "Plan y suscripción",
        href: (slug) => `/app/${slug}/plan`,
        icon: CreditCard,
      },
    ],
  },
];

/** Keys de módulos cuyo contexto depende de la sucursal activa (ADR-010). */
export const BRANCH_KEYS = [
  "catalogo",
  "pos",
  "pedidos",
  "pagos",
  "caja",
  "promociones",
  "precios",
  "inventario",
  "compras",
  "envios",
  "clientes",
  "agenda",
  "formularios",
  "gastos",
  "facturacion",
  "reportes",
];

/** Keys de módulos de ámbito tenant (global, no dependen de sucursal). */
export const TENANT_KEYS = [
  "overview",
  "presencia",
  "blog",
  "marketing",
  "organizacion",
  "sucursales",
  "usuarios",
  "roles",
  "notificaciones",
  "integraciones",
  "auditoria",
  "marketplace",
  "plan",
];
