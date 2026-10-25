import { ArrowUpRight, Clock, Mail, MessageCircle, Share2 } from "lucide-react";
import { SUPPORT } from "@/lib/content/support";
import { hubButton } from "@/components/dashboard/shared/styles";

/** Canales de contacto: misma fuente que la página /contacto de la landing. */
const CHANNELS = [
  {
    icon: MessageCircle,
    title: "WhatsApp",
    description: "La forma más rápida de resolver una duda.",
    ...SUPPORT.whatsapp,
  },
  {
    icon: Mail,
    title: "Correo",
    description: "Para consultas detalladas o soporte.",
    ...SUPPORT.email,
  },
];

export const ContactSection = () => {
  return (
    <div className="space-y-2">
      <ul className="grid gap-2 sm:grid-cols-2">
        {CHANNELS.map((channel) => (
          <li key={channel.title}>
            <a
              href={channel.href}
              target={channel.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group flex h-full items-center gap-3 rounded-sm border border-border p-2 transition-colors hover:bg-muted/50"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-muted text-foreground">
                <channel.icon className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{channel.title}</p>
                <p className="truncate text-sm text-muted-foreground">{channel.label}</p>
              </div>
              <ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
            </a>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center gap-3 rounded-sm border border-border p-2">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-muted text-foreground">
          <Share2 className="size-5" />
        </span>
        <p className="mr-auto text-sm font-medium">Redes sociales</p>
        {SUPPORT.social.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={hubButton.secondary}
          >
            {link.label}
          </a>
        ))}
      </div>

      <p className="flex items-center gap-2 px-1 pt-2 text-sm text-muted-foreground">
        <Clock className="size-4" />
        {SUPPORT.responseTime}
      </p>
    </div>
  );
};
