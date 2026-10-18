import {
  Briefcase,
  Building2,
  Globe,
  PackageCheck,
  Store,
  UserRound,
  Utensils,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type Industry = {
  id: string;
  label: string;
  short: string;
  icon: LucideIcon;
  headline: string;
  description: string;
  features: string[];
  modules: string[];
  examples: string[];
  // Placeholder: describe el video o imagen que irá en este bloque
  media: string;
  // Foto 1200x900 en /public/images/casos-de-uso/industrias (Unsplash)
  image?: string;
  // Tarjeta flotante sobre el video (snippet ilustrativo de la interfaz)
  snippet: { icon: LucideIcon; title: string; detail: string };
};

export const industries: Industry[] = [
  {
    id: "retail",
    label: "Comercio físico y retail",
    short: "Tiendas, minimarkets y boutiques",
    icon: Store,
    headline: "Vende en mostrador sin perder de vista tu stock",
    description:
      "Cada venta en el POS descuenta el inventario de la sucursal correcta. Cierras caja en minutos y ves qué productos se mueven en cada sede.",
    features: [
      "POS integrado y rápido",
      "Inventario por sucursal",
      "Control y cierre de caja",
      "Reportes de ventas al día",
    ],
    modules: ["POS", "Inventario", "Catálogo", "Reportes"],
    examples: ["Minimarkets", "Boutiques", "Ferreterías", "Librerías"],
    media: "Video: venta en POS y stock actualizándose",
    image: "/images/casos-de-uso/industrias/retail.webp",
    snippet: {
      icon: PackageCheck,
      title: "Stock actualizado",
      detail: "Sucursal Centro · −1 unidad",
    },
  },
  {
    id: "servicios",
    label: "Servicios profesionales",
    short: "Estudios, consultorías y talleres",
    icon: Briefcase,
    headline: "Cobra tus servicios y conoce a cada cliente",
    description:
      "Registra cada cobro, guarda el historial de tus clientes y revisa tus ingresos sin hojas de cálculo. Ideal para estudios, consultorías y talleres.",
    features: [
      "Cobros con POS",
      "CRM de clientes",
      "Historial de compras",
      "Reportes de ingresos",
    ],
    modules: ["POS", "CRM", "Reportes"],
    examples: ["Estudios", "Consultorías", "Talleres", "Centros de estética"],
    media: "Imagen: ficha de cliente en el CRM",
    image: "/images/casos-de-uso/industrias/servicios.webp",
    snippet: {
      icon: UserRound,
      title: "Cliente frecuente",
      detail: "8 compras · última hace 3 días",
    },
  },
  {
    id: "restaurantes",
    label: "Restaurantes y food service",
    short: "Cafeterías, panaderías y cocinas",
    icon: Utensils,
    headline: "Cobra rápido y controla cada insumo",
    description:
      "Atiende en mostrador o para llevar con un POS ágil, controla el stock de insumos por sucursal y cierra caja sin sorpresas al final del turno.",
    features: [
      "POS rápido para mostrador",
      "Inventario de insumos",
      "Control de caja por turno",
      "Reportes por sucursal",
    ],
    modules: ["POS", "Inventario", "Catálogo", "Reportes"],
    examples: ["Cafeterías", "Panaderías", "Dark kitchens", "Food trucks"],
    media: "Video: pedido para llevar y cierre de caja",
    image: "/images/casos-de-uso/industrias/restaurantes.webp",
    snippet: {
      icon: Wallet,
      title: "Caja cerrada",
      detail: "Turno mañana · cuadrada",
    },
  },
  {
    id: "omnicanal",
    label: "Empresas omnicanal",
    short: "Cadenas, e-commerce y franquicias",
    icon: Building2,
    headline: "Online y físico, con un solo inventario",
    description:
      "Unifica la tienda web, los canales externos y tus locales físicos. Todos venden del mismo stock y ves el consolidado de toda la organización.",
    features: [
      "Ventas online y físicas unificadas",
      "Múltiples canales de venta",
      "Consolidado de ventas",
      "Múltiples sucursales",
    ],
    modules: ["Presencia digital", "Inventario", "POS", "Reportes"],
    examples: ["Cadenas", "E-commerce + tienda", "Distribuidoras", "Franquicias"],
    media: "Video: pedido web que descuenta el mismo stock",
    image: "/images/casos-de-uso/industrias/omnicanal.webp",
    snippet: {
      icon: Globe,
      title: "Pedido web recibido",
      detail: "Mismo stock que tu tienda",
    },
  },
];
