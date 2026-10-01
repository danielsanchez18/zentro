"use client";

import { MoreHorizontal, Pencil, Power, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import { NATIVE_CHANNELS, type SalesChannel } from "@/lib/mock/channels";

interface ChannelCardProps {
  channel: SalesChannel;
  onEdit: (channel: SalesChannel) => void;
  onToggleStatus: (channel: SalesChannel) => void;
  onToggleOrders: (channel: SalesChannel) => void;
}

const iconFor = (key: SalesChannel["key"]) =>
  NATIVE_CHANNELS.find((c) => (c.key as string) === (key as string))?.icon;

/**
 * Tarjeta de un canal de venta propio de Zentro (POS, Web, Marketplace).
 */
export const ChannelCard = ({
  channel,
  onEdit,
  onToggleStatus,
  onToggleOrders,
}: ChannelCardProps) => {
  const Icon = iconFor(channel.key);
  const isActive = channel.status === "activo";

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onEdit(channel)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onEdit(channel);
        }
      }}
      className={cn(
        "group relative flex flex-col justify-between rounded-xl border border-border bg-card p-4 transition-all cursor-pointer font-heading",
        "hover:border-primary",
      )}
    >
      <div>
        {/* Cabecera: Ícono + Nombre + Menú contextual */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-muted-foreground transition-colors group-hover:text-primary">
              {Icon && <Icon className="size-4.5" />}
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                {channel.name}
              </h3>
              <p className="truncate text-xs font-sans text-muted-foreground mt-0.5">
                Canal propio de Zentro
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
                aria-label={`Acciones de ${channel.name}`}
              >
                <MoreHorizontal className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 font-heading">
                <DropdownMenuItem
                  onClick={() => onEdit(channel)}
                  className="py-1.5 px-2 cursor-pointer gap-2"
                >
                  <Pencil className="size-4" />
                  <span>Editar canal</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => onToggleOrders(channel)}
                  disabled={!isActive}
                  className="py-1.5 px-2 cursor-pointer gap-2"
                >
                  <ShoppingBag className="size-4" />
                  <span>
                    {channel.acceptsOrders
                      ? "Pausar pedidos"
                      : "Admitir pedidos"}
                  </span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => onToggleStatus(channel)}
                  className={cn(
                    "py-1.5 px-2 cursor-pointer gap-2",
                    isActive && "text-destructive",
                  )}
                >
                  <Power className="size-4" />
                  <span>{isActive ? "Desactivar canal" : "Activar canal"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Descripción */}
        <p className="mt-3 mb-1 text-sm text-muted-foreground line-clamp-2">
          {channel.description ||
            "Canal configurado para la recepción y gestión de ventas de la organización."}
        </p>
      </div>

      <div>
        <div className="my-3 border-t border-border" />

        {/* Footer: Estado operativo + Admisión de pedidos */}
        <div className="flex items-center justify-between gap-2">
          <StatusBadge
            status={isActive ? "activo" : "inactivo"}
            label={isActive ? "Activo" : "Inactivo"}
          />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleOrders(channel);
            }}
            disabled={!isActive}
            className={cn(
              "inline-flex items-center gap-1.5 text-nowrap rounded-lg px-2.5 py-1.75 text-[13px] font-medium leading-none transition-colors",
              !isActive
                ? "opacity-50 cursor-not-allowed bg-muted text-muted-foreground"
                : channel.acceptsOrders
                  ? "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 cursor-pointer"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer border border-border",
            )}
            title={
              !isActive
                ? "El canal debe estar activo para recibir pedidos"
                : channel.acceptsOrders
                  ? "Clic para pausar pedidos entrantes"
                  : "Clic para admitir pedidos entrantes"
            }
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                channel.acceptsOrders && isActive
                  ? "bg-primary"
                  : "bg-muted-foreground/50",
              )}
            />
            <span>
              {channel.acceptsOrders && isActive
                ? "Acepta pedidos"
                : "Pedidos pausados"}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
};
