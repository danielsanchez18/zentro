import { SUPPORT } from "@/lib/content/support";

const steps = [
  {
    number: "01",
    title: "Crea tu cuenta",
    description:
      `Regístrate gratis en minutos, sin tarjeta de crédito. Tu organización queda lista con ${SUPPORT.trialDays} días de prueba.`,
  },
  {
    number: "02",
    title: "Configura tu negocio",
    description:
      "Agrega tus sucursales, carga tu catálogo y define roles para tu equipo. Solo activas los módulos que necesites.",
  },
  {
    number: "03",
    title: "Empieza a vender",
    description:
      "Cobra con el POS, controla el inventario en tiempo real y toma decisiones con reportes consolidados.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-30 space-y-20 mx-auto">
      <div className="space-y-5 text-center max-w-xl mx-auto px-5">
        <p className="text-muted-foreground text-lg">¿Cómo funciona?</p>
        <h2 className="text-3xl lg:text-4xl font-semibold text-balance tracking-tight">
          Empieza a usar <span className="text-primary">Zentro</span> en 3 pasos
        </h2>
      </div>

      <div className="grid sm:grid-cols-3 gap-x-10 gap-y-10 mx-auto">
        {steps.map((step) => (
          <div
            key={step.number}
            className="grid grid-cols-[auto_1fr] gap-5 items-start"
          >
            <div className="h-10 w-10 min-w-10 mt-0.5 border-primary rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <p className="mb-0.5 text-xl font-oswald font-medium">
                {step.number}
              </p>
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold tracking-tight">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
