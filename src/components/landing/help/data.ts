import {
  BarChart3,
  Boxes,
  CreditCard,
  Globe,
  Rocket,
  ShoppingBag,
  UserCog,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type HelpTopic = {
  title: string;
  description: string;
  icon: LucideIcon;
  // Títulos de guías. Las páginas de cada guía aún no existen.
  articles: string[];
};

export const helpTopics: HelpTopic[] = [
  {
    title: "Primeros pasos",
    description: "Crea tu cuenta y deja tu negocio listo para operar.",
    icon: Rocket,
    articles: [
      "Crear tu cuenta y organización",
      "Agregar tus sucursales",
      "Activar los módulos que necesitas",
    ],
  },
  {
    title: "Catálogo",
    description: "Productos, precios, variantes y categorías.",
    icon: ShoppingBag,
    articles: [
      "Crear y editar productos",
      "Configurar variantes y precios",
      "Organizar por categorías y marcas",
    ],
  },
  {
    title: "Inventario",
    description: "Stock por sucursal, ajustes y alertas.",
    icon: Boxes,
    articles: [
      "Cargar el stock inicial",
      "Hacer ajustes y transferencias",
      "Configurar alertas de stock bajo",
    ],
  },
  {
    title: "POS y caja",
    description: "Cobros en mostrador y cierre del día.",
    icon: Wallet,
    articles: [
      "Registrar una venta en el POS",
      "Aplicar descuentos y promociones",
      "Abrir y cerrar caja",
    ],
  },
  {
    title: "CRM",
    description: "Clientes, historial y seguimiento.",
    icon: Users,
    articles: [
      "Registrar y buscar clientes",
      "Consultar el historial de compras",
      "Seguir oportunidades de venta",
    ],
  },
  {
    title: "Presencia digital",
    description: "Tu tienda web conectada al mismo stock.",
    icon: Globe,
    articles: [
      "Publicar tu tienda online",
      "Personalizar tu sitio web",
      "Recibir pedidos web",
    ],
  },
  {
    title: "Reportes",
    description: "Ventas, márgenes y consolidados.",
    icon: BarChart3,
    articles: [
      "Leer el dashboard de ventas",
      "Comparar sucursales",
      "Exportar reportes",
    ],
  },
  {
    title: "Equipo y permisos",
    description: "Invitaciones, roles y accesos.",
    icon: UserCog,
    articles: [
      "Invitar a tu equipo",
      "Crear roles y permisos",
      "Limitar accesos por sucursal",
    ],
  },
  {
    title: "Cuenta y facturación",
    description: "Planes, pagos y suscripción.",
    icon: CreditCard,
    articles: [
      "Cambiar de plan",
      "Descargar tus facturas",
      "Cancelar tu suscripción",
    ],
  },
];
