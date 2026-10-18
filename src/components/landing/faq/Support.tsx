import Link from "next/link";
import { ArrowRight, BookOpen, Mail, MonitorPlay } from "lucide-react";

const channels = [
  {
    icon: BookOpen,
    title: "Centro de ayuda",
    description:
      "Guías paso a paso para configurar tu organización y sacarle provecho a cada módulo.",
    href: "/ayuda",
    cta: "Ver guías",
  },
  {
    icon: Mail,
    title: "Escríbenos",
    description:
      "Cuéntanos cómo trabaja tu negocio y te respondemos lo antes posible.",
    href: "/contacto",
    cta: "Ir a contacto",
  },
  {
    icon: MonitorPlay,
    title: "Mira la demo",
    description:
      "Recorre el dashboard, el POS y el inventario por dentro antes de crear tu cuenta.",
    href: "/#demo",
    cta: "Ver demo",
  },
];

export function Support() {
  return (
    <div className="max-w-7xl grid sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10 lg:gap-8 py-20 px-4 sm:px-7 xl:px-10 mx-auto">
      {/* Title & Description */}
      <div className="sm:col-span-2 lg:col-span-3 max-w-3xl mx-auto text-center space-y-3 mb-10">
        <p className="text-muted-foreground text-lg">¿Sigues con dudas?</p>
        <h2 className="text-balance text-3xl lg:text-4xl font-semibold tracking-tight">
          Estamos para <span className="text-primary">ayudarte</span>
        </h2>
      </div>

      {channels.map((channel, index) => {
        const Icon = channel.icon;

        return (
          <div
            key={channel.title}
            className={`relative flex ${
              index === 0
                ? "sm:pe-6"
                : index === 1
                  ? "pt-6 sm:pt-0 sm:ps-6"
                  : "pt-6 sm:pt-0 lg:ps-6"
            }`}
          >
            <div className="h-10 w-10 min-w-10 mt-1 border-[2.3] border-primary rounded-xl flex items-center justify-center">
              <Icon className="size-5 text-primary" />
            </div>

            <div className="ms-6 space-y-3">
              <div>
                <h3 className="font-semibold mb-1">{channel.title}</h3>
                <p className="text-muted-foreground leading-normal">
                  {channel.description}
                </p>
              </div>
              <Link
                href={channel.href}
                className="group inline-flex items-center gap-x-1.5 text-base hover:underline font-medium text-primary"
              >
                {channel.cta}
              </Link>
            </div>

            {/* Separadores, igual que About del home */}
            {index === 1 && (
              <div className="absolute top-0 inset-s-0 w-full h-px bg-linear-to-r from-transparent via-border to-transparent sm:bg-linear-to-t sm:w-px sm:h-full"></div>
            )}
            {index === 2 && (
              <div className="absolute top-0 inset-s-0 w-full h-px bg-linear-to-r from-transparent via-border to-transparent sm:hidden lg:block sm:bg-linear-to-t sm:w-px sm:h-full"></div>
            )}
          </div>
        );
      })}
    </div>
  );
}
