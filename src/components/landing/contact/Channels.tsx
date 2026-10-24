import { Clock, Mail, MessageCircle, Share2, type LucideIcon } from "lucide-react";
import { SUPPORT } from "@/lib/content/support";


// Canales desde la fuente única (también la usan Footer y la Ayuda del Hub)
type Channel = {
  icon: LucideIcon;
  title: string;
  description: string;
  label?: string;
  href?: string;
  links?: readonly { label: string; href: string }[];
};

const channels: Channel[] = [
  {
    icon: MessageCircle,
    title: "WhatsApp",
    description: "La forma más rápida de resolver una duda o pedir una demo.",
    ...SUPPORT.whatsapp,
  },
  {
    icon: Mail,
    title: "Correo",
    description: "Para consultas detalladas, planes empresariales o soporte.",
    ...SUPPORT.email,
  },
  {
    icon: Share2,
    title: "Redes sociales",
    description: "Novedades del producto, tips para tu negocio y promociones.",
    links: SUPPORT.social,
  },
];

export function Channels() {
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <p className="text-muted-foreground">Canales directos</p>
        <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-balance">
          Elige cómo prefieres{" "}
          <span className="text-primary">contactarnos</span>
        </h2>
      </div>

      <div className="space-y-8">
        {channels.map((channel, index) => {
          const Icon = channel.icon;

          return (
            <div key={channel.title} className="relative flex pt-8 first:pt-0">
              {index > 0 && (
                <div className="absolute top-0 inset-s-0 w-full h-px bg-linear-to-r from-transparent via-border to-transparent" />
              )}
              {/* <div className="h-10 w-10 min-w-10 mt-1 border-[2.3] border-primary rounded-xl flex items-center justify-center">
                <Icon className="size-5 text-primary" />
              </div> */}
              <Icon className="size-4.5 text-primary mt-0.5" />
              <div className="ms-3 space-y-2">
                <div>
                  <h3 className="font-semibold mb-1">{channel.title}</h3>
                  <p className="text-muted-foreground leading-normal">
                    {channel.description}
                  </p>
                </div>
                {channel.href ? (
                  <a
                    href={channel.href}
                    target={
                      channel.href.startsWith("http") ? "_blank" : undefined
                    }
                    rel="noopener noreferrer"
                    className="inline-block font-medium text-primary hover:underline"
                  >
                    {channel.label}
                  </a>
                ) : (
                  <div className="flex gap-x-4">
                    {channel.links?.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary hover:underline"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="flex items-center gap-x-3 text-muted-foreground">
        <Clock className="size-4" />
        {SUPPORT.responseTime}
      </p>
    </div>
  );
}
