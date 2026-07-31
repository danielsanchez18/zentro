"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqItem {
  q: string;
  a: string;
}

interface FaqGroup {
  topic: string;
  items: FaqItem[];
}

// TODO(0.2): mover a datos dinámicos (GET /faq) si hace falta
const FAQ_GROUPS: FaqGroup[] = [
  {
    topic: "Suscripciones y pagos",
    items: [
      {
        q: "¿Cuándo se renueva mi suscripción?",
        a: "El cobro se realiza el primer día de cada período. Puedes ver tus fechas y próximos cobros en la página de Suscripciones.",
      },
      {
        q: "¿Puedo cambiar de plan?",
        a: "Sí. La gestión de plan se hace desde la configuración de cada organización, en la sección Facturación.",
      },
      {
        q: "¿Qué métodos de pago aceptan?",
        a: "Estamos integrando Culqi y Mercado Pago para tarjetas de crédito/débito y métodos como Yape y Plin. Pronto estarán disponibles.",
      },
    ],
  },
  {
    topic: "Cuenta y acceso",
    items: [
      {
        q: "¿Cómo cambio mi contraseña?",
        a: "Entra a tu perfil (avatar arriba a la derecha) y busca la sección de contraseña. Te pediremos tu contraseña actual.",
      },
      {
        q: "No recibo el correo de verificación",
        a: "Revisa la carpeta de spam. Si no aparece, puedes reenviar la verificación desde tu perfil.",
      },
    ],
  },
  {
    topic: "Organizaciones e invitaciones",
    items: [
      {
        q: "¿Cómo invito a alguien a mi organización?",
        a: "Abre la organización y entra a la sección Miembros. Ahí puedes enviar invitaciones por correo con un rol asignado.",
      },
      {
        q: "¿Puedo pertenecer a varias organizaciones?",
        a: "Sí. Puedes aceptar invitaciones de varias organizaciones y cambiar entre ellas con el selector de organización.",
      },
    ],
  },
];

export const FaqAccordion = () => {
  return (
    <div className="space-y-8">
      {FAQ_GROUPS.map((group, groupIndex) => (
        <section key={group.topic} aria-labelledby={`faq-${groupIndex}`} className="space-y-5">
          <h3
            id={`faq-${groupIndex}`}
            className="font-medium text-muted-foreground font-sans"
          >
            0{groupIndex + 1}. {group.topic}
          </h3>
          <Accordion className="mt-2">
            {group.items.map((item) => (
              <AccordionItem key={item.q} value={item.q}>
                <AccordionTrigger className="font-sans py-3 text-base">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground text-base">{item.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      ))}
    </div>
  );
};
