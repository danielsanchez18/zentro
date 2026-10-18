// Imagen pendiente: descomentar cuando existan /images/services/*.png
// import Image from "next/image";

const modules = [
  {
    title: "Catálogo",
    description:
      "Publica tus productos con fotos, precios, variantes y categorías. El mismo catálogo alimenta tu tienda web, el POS y el inventario.",
    img: "/images/services/catalogo.png",
  },
  {
    title: "POS",
    description:
      "Cobra en mostrador con una interfaz rápida: busca el producto, aplica descuentos y cierra la caja del día sin complicaciones.",
    img: "/images/services/pos.png",
  },
  {
    title: "Inventario",
    description:
      "Controla el stock por sucursal, recibe alertas de productos por agotar y haz ajustes con historial de movimientos. Sin hojas de cálculo.",
    img: "/images/services/inventario.png",
  },
  {
    title: "CRM",
    description:
      "Registra a tus clientes, consulta su historial de compras y sigue oportunidades de venta para fidelizar y volver a vender.",
    img: "/images/services/crm.png",
  },
  {
    title: "Presencia digital",
    description:
      "Tu tienda online con el catálogo de siempre: los pedidos llegan al mismo inventario y nunca vendes lo que no tienes.",
    img: "/images/services/presencia-digital.png",
  },
  {
    title: "Reportes",
    description:
      "Dashboards de ventas, productos y sucursales para ver qué está funcionando y decidir con datos, no con intuición.",
    img: "/images/services/reportes.png",
  },
];

export function Modules() {
  return (
    <section>
      <div className="space-y-3 text-center max-w-3xl mx-auto px-5 mt-20">
        <h2 className="text-2xl md:text-3xl font-semibold">
          Seis módulos, una sola plataforma
        </h2>
        <p className="text-muted-foreground">
          Activa solo lo que tu negocio necesita. Cada módulo comparte los
          mismos datos, así que todo queda sincronizado.
        </p>
      </div>

      <div className="py-20 grid md:grid-cols-2 gap-10">
        {modules.map((module) => (
          <article
            key={module.title}
            className="grid grid-cols-2 items-center gap-x-5"
          >
            {/* Imagen pendiente: /images/services/*.png (aún no existen)
            <div className="h-60 max-w-60 rounded-xl overflow-hidden bg-muted">
              <Image
                src={module.img}
                alt={module.title}
                width={480}
                height={480}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            */}
            <div className="h-60 rounded-xl bg-muted" aria-hidden="true"></div>
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-neutral-100">
                {module.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {module.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
