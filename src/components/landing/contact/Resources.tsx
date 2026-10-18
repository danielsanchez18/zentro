import Link from "next/link";
import { BookOpen, CreditCard, MessageCircleQuestion } from "lucide-react";

const resources = [
  {
    icon: MessageCircleQuestion,
    title: "Preguntas frecuentes",
    description:
      "Respuestas rápidas sobre la prueba gratis, planes, módulos y seguridad.",
    href: "/faq",
    cta: "Ver preguntas",
  },
  {
    icon: BookOpen,
    title: "Centro de ayuda",
    description:
      "Guías paso a paso para configurar tu organización y cada módulo.",
    href: "/ayuda",
    cta: "Ver guías",
  },
  {
    icon: CreditCard,
    title: "Planes y precios",
    description:
      "Compara los planes y elige el que mejor se adapta a tu negocio.",
    href: "/planes",
    cta: "Ver planes",
  },
];

export function Resources() {
  return (
    <div className="max-w-7xl grid sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10 lg:gap-8 py-20 px-4 sm:px-7 xl:px-10 mx-auto">
      {/* Title & Description */}
      <div className="sm:col-span-2 lg:col-span-3 max-w-3xl mx-auto text-center space-y-3 mb-10">
        <p className="text-muted-foreground text-lg">Antes de escribir</p>
        <h2 className="text-balance text-3xl lg:text-4xl font-semibold tracking-tight">
          Quizás tu respuesta <span className="text-primary">ya está aquí</span>
        </h2>
      </div>

      {resources.map((resource, index) => {
        const Icon = resource.icon;

        return (
          <div
            key={resource.title}
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
                <h3 className="font-semibold mb-1">{resource.title}</h3>
                <p className="text-muted-foreground leading-normal">
                  {resource.description}
                </p>
              </div>
              <Link
                href={resource.href}
                className="inline-flex text-base hover:underline font-medium text-primary"
              >
                {resource.cta}
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
