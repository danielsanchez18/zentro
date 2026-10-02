"use client";

import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModuleLinkData {
  href: string;
  label: string;
  subtitle?: string;
  description?: string;
  icon: LucideIcon;
}

interface ConfigurationModuleLinksProps {
  links: ModuleLinkData[];
}

/**
 * Grid de cards con accesos directos a configuraciones de otros módulos (Caja, Agenda, Equipo).
 */
export const ConfigurationModuleLinks = ({
  links,
}: ConfigurationModuleLinksProps) => {
  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-lg font-medium text-foreground">
          Configuraciones de módulos
        </h2>
        <p className="text-sm text-muted-foreground">
          Ajustes específicos disponibles directamente en sus respectivos
          módulos.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {links.map(({ href, label, subtitle, description, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "group relative flex flex-col justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary font-heading",
            )}
          >
            <div>
              {/* Header: Ícono + Título + Subtítulo y Chevron */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-4.5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                      {label}
                    </h3>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {subtitle ?? "Módulo del sistema"}
                    </p>
                  </div>
                </div>

                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground/60 transition-colors group-hover:bg-accent group-hover:text-primary">
                  <ChevronRight className="size-4" />
                </span>
              </div>

              {/* Descripción */}
              {description && (
                <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">
                  {description}
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-border/50 pt-3">
              <span className="text-sm text-muted-foreground">
                Ajustes del módulo
              </span>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors group-hover:text-primary">
                Configurar
                <ChevronRight className="size-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
