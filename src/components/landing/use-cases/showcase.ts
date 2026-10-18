// Negocios de ejemplo para la marquesina del hero de /casos-de-uso.
// Fotos: Unsplash (licencia Unsplash), optimizadas a WebP 640x768 en
// /public/images/casos-de-uso/negocios. Sin `image` se muestra un placeholder.
export type ShowcaseBusiness = {
  industryId: string;
  name: string;
  tagline: string;
  modules: string[];
  photo: string;
  image?: string;
};

export const showcase: ShowcaseBusiness[] = [
  {
    industryId: "retail",
    name: "Minimarket",
    tagline: "Ventas rápidas y stock al día en cada góndola",
    modules: ["POS", "Inventario"],
    photo: "Foto: minimarket de barrio con cliente en caja",
    image: "/images/casos-de-uso/negocios/minimarket.webp",
  },
  {
    industryId: "restaurantes",
    name: "Cafetería",
    tagline: "Cobra en segundos, incluso en hora punta",
    modules: ["POS", "Caja"],
    photo: "Foto: barista atendiendo en mostrador",
    image: "/images/casos-de-uso/negocios/cafeteria.webp",
  },
  {
    industryId: "servicios",
    name: "Taller mecánico",
    tagline: "Cobros e historial de cada cliente y vehículo",
    modules: ["POS", "CRM"],
    photo: "Foto: mecánico revisando un auto",
    image: "/images/casos-de-uso/negocios/taller-mecanico.webp",
  },
  {
    industryId: "omnicanal",
    name: "Tienda + e-commerce",
    tagline: "La web y el local venden del mismo stock",
    modules: ["Presencia digital", "Inventario"],
    photo: "Foto: empaque de pedidos online en tienda",
    image: "/images/casos-de-uso/negocios/tienda-ecommerce.webp",
  },
  {
    industryId: "retail",
    name: "Boutique de moda",
    tagline: "Tallas, colores y variantes bajo control",
    modules: ["Catálogo", "POS"],
    photo: "Foto: boutique con percheros y vendedora",
    image: "/images/casos-de-uso/negocios/boutique.webp",
  },
  {
    industryId: "restaurantes",
    name: "Panadería",
    tagline: "Insumos controlados y caja cuadrada por turno",
    modules: ["Inventario", "Reportes"],
    photo: "Foto: panadero sacando pan del horno",
    image: "/images/casos-de-uso/negocios/panaderia.webp",
  },
  {
    industryId: "servicios",
    name: "Centro de estética",
    tagline: "Clientes frecuentes que siempre vuelven",
    modules: ["CRM", "POS"],
    photo: "Foto: recepción de salón de belleza",
    image: "/images/casos-de-uso/negocios/centro-estetica.webp",
  },
  {
    industryId: "omnicanal",
    name: "Cadena de tiendas",
    tagline: "Varias sedes, un solo consolidado de ventas",
    modules: ["Reportes", "Inventario"],
    photo: "Foto: fachada de tienda de una cadena",
    image: "/images/casos-de-uso/negocios/cadena-tiendas.webp",
  },
  {
    industryId: "retail",
    name: "Ferretería",
    tagline: "Miles de productos en un solo catálogo",
    modules: ["Catálogo", "Inventario"],
    photo: "Foto: pasillo de ferretería con estantes",
    image: "/images/casos-de-uso/negocios/ferreteria.webp",
  },
  {
    industryId: "restaurantes",
    name: "Food truck",
    tagline: "Vende donde estés y cierra caja al final del día",
    modules: ["POS", "Reportes"],
    photo: "Foto: food truck atendiendo en la calle",
    image: "/images/casos-de-uso/negocios/food-truck.webp",
  },
];
