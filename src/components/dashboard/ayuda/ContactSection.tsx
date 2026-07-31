import { Clock, Mail, MessageCircle } from "lucide-react";

const CONTACTS = [
  {
    icon: Mail,
    title: "Correo",
    value: "soporte@zentro.com",
    hint: "Respuesta en 24 h hábiles",
    href: "mailto:soporte@zentro.com",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: "+51 999 999 999",
    hint: "Atención el mismo día",
    href: "https://wa.me/51999999999",
  },
  {
    icon: Clock,
    title: "Horario",
    value: "Lun a Vie · 9:00 a 18:00",
    hint: "Hora Perú (GMT-5)",
  },
];

export const ContactSection = () => {
  return (
    <section aria-labelledby="contacto-title">
      <h2 id="contacto-title" className="text-base font-medium">
        Contacto
      </h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-3">
        {CONTACTS.map((contact) => {
          const content = (
            <>
              <div className="flex size-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <contact.icon className="size-5" />
              </div>
              <h3 className="mt-4 text-sm font-medium">{contact.title}</h3>
              <p className="mt-1 text-sm">{contact.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {contact.hint}
              </p>
            </>
          );

          return (
            <li key={contact.title}>
              {contact.href ? (
                <a
                  href={contact.href}
                  className="block h-full rounded-xl border border-border bg-card p-5 transition-colors hover:bg-muted/40"
                >
                  {content}
                </a>
              ) : (
                <div className="h-full rounded-xl border border-border bg-card p-5">
                  {content}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};
