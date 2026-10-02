import Link from "next/link";
import Image from "next/image";

const modules = [
  {
    name: "Catálogo",
    description: "Productos, precios y marcas centralizados",
    url: "/servicios",
    img: "/images/modules/catalogo.png",
  },
  {
    name: "POS",
    description: "Cobra en caja rápido y sencillo",
    url: "/servicios",
    img: "/images/modules/pos.png",
  },
  {
    name: "Inventario",
    description: "Stock por sucursal en tiempo real",
    url: "/servicios",
    img: "/images/modules/inventario.png",
  },
  {
    name: "CRM",
    description: "Clientes e historial en un solo lugar",
    url: "/servicios",
    img: "/images/modules/crm.png",
  },
  {
    name: "Presencia digital",
    description: "Web, blog y canales bajo una marca",
    url: "/servicios",
    img: "/images/modules/presencia.png",
  },
  {
    name: "Reportes",
    description: "Ventas por sucursal y consolidadas",
    url: "/servicios",
    img: "/images/modules/reportes.png",
  },
];

export function Modules() {
  return (
    <div className="mt-20 space-y-10">
      {/* Title & Description */}
      <div className="max-w-3xl mx-auto text-center space-y-3">
        <h2 className="font-semibold text-3xl lg:text-4xl text-balance tracking-tight">
          Un <span className="text-primary">ecosistema</span> modular y flexible
        </h2>
        <p className="text-muted-foreground">
          Activa solo los módulos que necesitas y escala cuando lo requieras.
        </p>
      </div>

      {/* Modules grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {modules.map((module, idx) => (
          <Link
            key={idx}
            href={module.url}
            className="group w-full block border border-border rounded-xl outline outline-transparent hover:border-primary hover:outline-primary hover:shadow-lg dark:hover:shadow-primary/5 transition duration-300 overflow-hidden bg-card"
          >
            {/* Image — descomenta la línea <Image /> cuando tengas la imagen en /public{module.img} */}
            <div className="relative pt-[50%] bg-muted overflow-hidden">
              {/* <Image src={module.img} alt={module.name} fill className="object-cover" /> */}
            </div>

            {/* Title & Description */}
            <div className="px-5 py-3 border-t border-border">
              <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {module.name}
              </h4>
              <p className="text-muted-foreground">{module.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
