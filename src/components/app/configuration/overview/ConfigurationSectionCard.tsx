"use client";

import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  StatusBadge,
  type BadgeStatus,
} from "@/components/app/shared/StatusBadge";

export interface SectionCardStat {
  label: string;
  value: string;
}

export interface SectionCardData {
  href: string;
  label: string;
  subtitle?: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
  statusBadge?: {
    status: BadgeStatus;
    label: string;
  };
  stats?: SectionCardStat[];
}

interface ConfigurationSectionCardProps {
  section: SectionCardData;
}

/**
 * Tarjeta de navegación de sección principal en el Centro de configuración.
 * Estilo visual alineado al sistema de cards de Zentro (Permisos / Módulos).
 */
export const ConfigurationSectionCard = ({
  section,
}: ConfigurationSectionCardProps) => {
  const {
    href,
    label,
    subtitle,
    description,
    icon: Icon,
    badge,
    statusBadge,
    stats,
  } = section;

  return (
    <article className="h-full font-heading">
      <Link
        href={href}
        className={cn(
          "group relative flex h-full flex-col justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary",
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
                  {subtitle ??
                    (badge
                      ? `${badge} ${Number(badge) === 1 ? "activa" : "activas"}`
                      : "Configuración del negocio")}
                </p>
              </div>
            </div>

            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground/60 transition-colors group-hover:bg-accent group-hover:text-primary">
              <ChevronRight className="size-4" />
            </span>
          </div>

          {/* Descripción */}
          <p className="mt-4 line-clamp-2 min-h-10 text-sm text-muted-foreground">
            {description}
          </p>

          {/* Estadísticas / Metadatos */}
          {stats && stats.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3 border-y border-border py-3 text-sm">
              {stats.map((s) => (
                <div key={s.label} className="min-w-0">
                  <p className="truncate text-xs text-muted-foreground">
                    {s.label}
                  </p>
                  <p className="mt-1 truncate font-medium text-foreground">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer: StatusBadge */}
        <div className="mt-3 flex items-center justify-between gap-3">
          {statusBadge ? (
            <StatusBadge
              status={statusBadge.status}
              label={statusBadge.label}
            />
          ) : badge ? (
            <StatusBadge
              status="activo"
              label={`${badge} ${Number(badge) === 1 ? "activa" : "activas"}`}
            />
          ) : (
            <StatusBadge status="activo" label="Habilitada" />
          )}
        </div>
      </Link>
    </article>
  );
};
