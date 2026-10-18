import {
  BrainCircuit,
  ChartPie,
  Check,
  HandCoins,
  Mails,
  MonitorCog,
  TrendingUpDown,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const services = [
  {
    icon: BrainCircuit,
    title: "Automatiza lo repetitivo",
    description:
      "Alertas de stock, cierres de caja y reportes periódicos se generan solos. Tu equipo se concentra en vender, no en cargar datos.",
    lead: "Deja que Zentro haga el trabajo aburrido por ti.",
    points: [
      "Alertas de stock bajo antes de que se agote",
      "Cierre de caja sin hojas de cálculo",
      "Tus ventas y stock siempre al día",
    ],
  },
  {
    icon: HandCoins,
    title: "Cobra más rápido",
    description:
      "El POS de Zentro registra cada venta en segundos, aplica precios y promociones y actualiza el inventario al instante.",
    lead: "Cada segundo en caja cuenta.",
    points: [
      "Registro de venta en segundos",
      "Precios y promociones aplicados solos",
      "Inventario actualizado al cobrar",
    ],
  },
  {
    icon: ChartPie,
    title: "Reportes que deciden",
    description:
      "Ventas, márgenes y stock por sucursal, consolidados en tableros claros para que decidas con datos, no con intuición.",
    lead: "Los números de tu negocio, claros y a la vista.",
    points: [
      "Ventas y márgenes por sucursal",
      "Productos que más y menos salen",
      "Una vista consolidada de toda la organización",
    ],
  },
  {
    icon: MonitorCog,
    title: "Control total desde un panel",
    description:
      "Administra sucursales, usuarios y configuración desde un único panel, con cada cambio reflejado en tiempo real.",
    lead: "Tu negocio entero, desde una sola pantalla.",
    points: [
      "Sucursales, usuarios y roles en un lugar",
      "Permisos por módulo y por sede",
      "Cambios reflejados en tiempo real",
    ],
  },
  {
    icon: Mails,
    title: "Avisos que llegan a tiempo",
    description:
      "Notificaciones de ventas, stock bajo y actividad de tu equipo, para que nada te tome por sorpresa.",
    lead: "Zentro te avisa antes de que sea tarde.",
    points: [
      "Stock bajo y quiebres de inventario",
      "Movimientos importantes de ventas",
      "Actividad de tu equipo, cuando importa",
    ],
  },
  {
    icon: TrendingUpDown,
    title: "Crece a tu ritmo",
    description:
      "Empieza con los módulos esenciales y activa nuevos módulos cuando tu negocio lo pida. Sin migraciones ni dolores de cabeza.",
    lead: "Empieza pequeño. Escala cuando quieras.",
    points: [
      "Módulos que se activan en minutos",
      "Multi-sucursal de serie, sin costos ocultos",
      "Sin migraciones ni reinstalaciones",
    ],
  },
];

export function Features() {
  return (
    <section className="pt-32">
      <div className="space-y-3 text-center max-w-xl mx-auto px-5">
        <p className="text-muted-foreground">
          Desde el mostrador hasta la dirección
        </p>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-neutral-100">
          Un servicio completo para operar, vender y crecer
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-16 md:gap-x-20 py-20">
        {services.map((service) => {
          const Icon = service.icon;

          return (
            <article key={service.title} className="grid gap-y-4">
              <Icon className="size-8 stroke-[1.5] text-primary" />
              <h3 className="font-semibold text-gray-900 dark:text-neutral-100 max-sm:text-sm">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {service.description}
              </p>

              <Dialog>
                <DialogTrigger className="mr-auto text-sm text-primary underline underline-offset-4 hover:text-primary-dark w-fit cursor-pointer">
                  Más información
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <div className="h-10 w-10 border-[2.3] border-primary rounded-xl flex items-center justify-center mb-2">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <DialogTitle>{service.title}</DialogTitle>
                    <DialogDescription>{service.lead}</DialogDescription>
                  </DialogHeader>
                  <ul className="grid gap-y-3 mt-2">
                    {service.points.map((point) => (
                      <li key={point} className="flex items-start gap-x-3">
                        <Check className="size-4 mt-0.5 text-primary shrink-0" />
                        <span className="text-sm text-foreground">{point}</span>
                      </li>
                    ))}
                  </ul>
                </DialogContent>
              </Dialog>
            </article>
          );
        })}
      </div>
    </section>
  );
}
