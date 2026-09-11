"use client";

import {
  Armchair,
  Box,
  DoorOpen,
  Eye,
  MoreHorizontal,
  Pencil,
  Store,
  TableProperties,
  Trash2,
  Power,
  PowerOff,
  Link2Off,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import type { PosServicePoint } from "@/lib/mock/pos";
import { cn } from "@/lib/utils";

const icons = {
  mesa: TableProperties,
  mostrador: Store,
  box: Box,
  cabina: DoorOpen,
  silla: Armchair,
};

export function ServicePointCard({
  point,
  selected,
  onSelect,
  onEdit,
  onToggle,
  onDelete,
  onOrder,
  onDragStart,
  onDragEnd,
  onDrop,
  onUngroup,
}: {
  point: PosServicePoint;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
  onOrder: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDrop: () => void;
  onUngroup: () => void;
}) {
  const Icon = icons[point.kind];
  const selectable = point.status === "disponible";
  return (
    <article
      role="button"
      tabIndex={selectable ? 0 : -1}
      aria-pressed={selected}
      onClick={() => selectable && onSelect()}
      onKeyDown={(event) => {
        if (selectable && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onSelect();
        }
      }}
      draggable={selectable && point.kind === "mesa"}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        onDrop();
      }}
      className={cn(
        "relative flex min-h-36 flex-col rounded-xl border bg-card p-4 transition-all text-left select-none",
        selectable
          ? "cursor-pointer hover:border-primary/50 hover:bg-muted/20 hover:shadow-xs"
          : "opacity-75 cursor-default",
        selected ? "border-primary bg-primary/5 " : "border-border",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "flex p-3 shrink-0 items-center justify-center rounded-lg transition-colors",
              selected
                ? "bg-primary/15 text-primary"
                : "bg-muted text-foreground",
            )}
          >
            <Icon className="size-4" />
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            onClick={(event) => event.stopPropagation()}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label={`Acciones de ${point.name}`}
          >
            <MoreHorizontal className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil />
              Editar
            </DropdownMenuItem>
            {point.associatedOrderId ? (
              <DropdownMenuItem onClick={onOrder}>
                <Eye />
                Ver pedido asociado
              </DropdownMenuItem>
            ) : null}
            {point.memberIds?.length ? (
              <DropdownMenuItem onClick={onUngroup}>
                <Link2Off />
                Separar mesas
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onToggle}>
              {point.status === "inactivo" ? <Power /> : <PowerOff />}
              {point.status === "inactivo" ? "Habilitar" : "Deshabilitar"}
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={onDelete}>
              <Trash2 />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-3 font-heading">
        <span className="block truncate text-sm font-medium">{point.name}</span>
        <span className="block text-sm capitalize text-muted-foreground">
          {point.kind} · máx. {point.capacity} personas
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <StatusBadge status={point.status} />
        {point.kind === "mesa" && selectable ? (
          <p className="text-sm font-heading text-muted-foreground">
            Arrastra para juntar
          </p>
        ) : null}
      </div>
    </article>
  );
}
