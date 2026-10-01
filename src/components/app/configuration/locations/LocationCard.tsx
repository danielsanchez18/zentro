"use client";

import {
  MapPin,
  Phone,
  Clock,
  Pencil,
  Trash2,
  Globe,
  Star,
  MoreHorizontal,
  EyeOff,
  CircleSlash,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import type { WorkspaceLocation } from "@/lib/mock/locations";

interface LocationCardProps {
  location: WorkspaceLocation;
  functionLabels: (keys: WorkspaceLocation["functions"]) => string[];
  onEdit: () => void;
  onRemove: () => void;
  onTogglePublished: () => void;
}

/**
 * Card de una ubicación dentro de Configuración → Ubicaciones.
 *
 * Muestra estado, funciones operativas, datos de contacto y presencia pública.
 * La tarjeta completa es interactiva y permite editarla al hacer clic.
 */
export const LocationCard = ({
  location,
  functionLabels,
  onEdit,
  onRemove,
  onTogglePublished,
}: LocationCardProps) => {
  const labels = functionLabels(location.functions);
  const isActive = location.status === "ACTIVE";

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onEdit}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onEdit();
        }
      }}
      className={cn(
        "group relative flex flex-col justify-between rounded-xl border border-border bg-card p-4 transition-all cursor-pointer",
        "hover:border-primary",
      )}
    >
      <div>
        {/* Cabecera: Ícono + Nombre + Principal + Menú de acciones */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <MapPin className="size-5" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                  {location.name}
                </h3>
                {location.isPrimary && (
                  <Star className="size-3 stroke-1 fill-current" />
                )}
              </div>

              <p className="truncate text-xs font-heading text-muted-foreground">
                {location.address || "Sin dirección registrada"}
              </p>
            </div>
          </div>

          {/* Menú de acciones contextuales */}
          <div
            className="flex items-center shrink-0"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <DropdownMenu>
              <DropdownMenuTrigger
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer outline-none transition-colors"
                aria-label={`Acciones de ${location.name}`}
              >
                <MoreHorizontal className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={onEdit}
                  className="py-1.5 px-2 cursor-pointer gap-2"
                >
                  <Pencil className="size-4" />
                  <span>Editar ubicación</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onTogglePublished}
                  className="py-1.5 px-2 cursor-pointer gap-2"
                >
                  <Globe className="size-4" />
                  <span>
                    {location.publicProfile.published
                      ? "Ocultar de catálogo"
                      : "Publicar en catálogo"}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={onRemove}
                  className="py-1.5 px-2 cursor-pointer gap-2 text-destructive"
                >
                  <Trash2 className="size-4" />
                  <span>Eliminar ubicación</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="my-3 border-t border-border" />

        {/* Funciones operativas ("¿Qué sucede aquí?") */}
        <div className="space-y-2">
          <p className="text-sm font-heading font-medium text-muted-foreground">
            Funciones habilitadas
          </p>
          <div className="flex flex-wrap gap-1.5">
            {labels.map((label) => (
              <span
                key={label}
                className="inline-flex items-center rounded-md border border-border/70 bg-accent/40 px-2.25 py-1.75 leading-none text-sm font-heading font-medium text-foreground"
              >
                {label}
              </span>
            ))}
            {labels.length === 0 && (
              <div className="flex items-center gap-2">
                <CircleSlash className="size-3.5 shrink-0 text-muted-foreground/70" />
                <span className="text-sm text-muted-foreground">
                  Sin funciones operativas
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Datos de contacto / horario si existen */}
        {(location.phone || location.openingHours) && (
          <>
            <div className="my-3 border-t border-border" />
            <div className="space-y-1.5 text-xs text-muted-foreground">
              {location.phone && (
                <div className="flex items-center gap-2 truncate">
                  <Phone className="size-3.5 shrink-0 text-muted-foreground/70" />
                  <span className="truncate">{location.phone}</span>
                </div>
              )}
              {location.openingHours && (
                <div className="flex items-center gap-2 truncate">
                  <Clock className="size-3.5 shrink-0 text-muted-foreground/70" />
                  <span className="truncate">{location.openingHours}</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div>
        <div className="my-3 border-t border-border" />

        {/* Footer: Estado operativo + Presencia pública */}
        <div className="flex items-center justify-between gap-2">
          <StatusBadge
            status={isActive ? "activo" : "inactivo"}
            label={isActive ? "Activa" : "Inactiva"}
          />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePublished();
            }}
            className={cn(
              "inline-flex items-center gap-1 text-nowrap rounded-lg px-2.5 py-2 text-[13px] font-medium font-heading cursor-pointer",
              location.publicProfile.published
                ? "border-none text-primary bg-primary/10"
                : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
            title={
              location.publicProfile.published
                ? "Visible en catálogo online. Clic para ocultar."
                : "Oculta. Clic para hacer pública."
            }
          >
            {location.publicProfile.published ? (
              <Globe className="size-3.5" />
            ) : (
              <EyeOff className="size-3.5" />
            )}
            <span className="text-nowrap leading-none">
              {location.publicProfile.published ? "Pública" : "Privada"}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
};
