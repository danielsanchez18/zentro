"use client";

import { useState } from "react";
import { Clock, MapPin, Pencil, Phone, Plus, Store, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import { HubStatusChip } from "@/components/dashboard/shared/HubStatusChip";
import { hubButton, hubStatus, hubTone } from "@/components/dashboard/shared/styles";
import { cn } from "@/lib/utils";
import type { LocalData } from "./constants";

interface LocalStepProps {
  locations: LocalData[];
  onLocationsChange: (locations: LocalData[]) => void;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
}

const EMPTY: LocalData = { nombre: "", direccion: "", telefono: "", horario: "" };

const FIELDS: { key: keyof LocalData; label: string; placeholder: string; icon: typeof MapPin }[] = [
  { key: "nombre", label: "Nombre", placeholder: "Ej: Sede Miraflores", icon: Store },
  { key: "direccion", label: "Dirección", placeholder: "Ej: Av. Larco 1234", icon: MapPin },
  { key: "telefono", label: "Teléfono", placeholder: "+51 999 999 999", icon: Phone },
  { key: "horario", label: "Horario", placeholder: "Lun-Vie 09:00-18:00", icon: Clock },
];

/** Modal para crear o editar una ubicación. */
const LocationDialog = ({
  open,
  initial,
  isEditing,
  onCancel,
  onSave,
}: {
  open: boolean;
  initial: LocalData;
  isEditing: boolean;
  onCancel: () => void;
  onSave: (location: LocalData) => void;
}) => {
  const [form, setForm] = useState<LocalData>(initial);
  const valid = form.nombre.trim().length > 0;

  return (
    <ResponsiveDialog open={open} onOpenChange={(next) => !next && onCancel()}>
      <ResponsiveDialogContent className="md:max-w-lg">
        <form
          className="flex flex-col gap-5 px-4 pb-4 md:px-0 md:pb-0"
          onSubmit={(event) => {
            event.preventDefault();
            if (valid) onSave(form);
          }}
        >
          <div>
            <ResponsiveDialogTitle className="font-sans text-base font-medium">
              {isEditing ? "Editar ubicación" : "Nueva ubicación"}
            </ResponsiveDialogTitle>
            <ResponsiveDialogDescription className="mt-1 text-sm">
              Puede ser una tienda, consultorio, almacén o punto de atención.
            </ResponsiveDialogDescription>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {FIELDS.map(({ key, label, placeholder, icon: Icon }) => (
              <div key={key} className={key === "direccion" || key === "nombre" ? "sm:col-span-2" : undefined}>
                <label htmlFor={`location-${key}`} className="mb-1.5 block text-[13px] font-medium text-foreground/80">
                  {label}
                  {key === "nombre" && <span className="text-destructive"> *</span>}
                </label>
                <div className="relative">
                  <Icon
                    className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                    strokeWidth={1.5}
                  />
                  <Input
                    id={`location-${key}`}
                    value={form[key]}
                    autoFocus={key === "nombre"}
                    onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                    placeholder={placeholder}
                    className="pl-9 text-sm"
                  />
                </div>
              </div>
            ))}
          </div>

          <div data-hub-footer className="flex">
            <button type="button" className={hubButton.secondary} onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className={hubButton.primary} disabled={!valid}>
              {isEditing ? "Guardar cambios" : "Agregar ubicación"}
            </button>
          </div>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

/** Tarjeta de resumen de una ubicación ya definida. */
const LocationCard = ({
  location,
  primary,
  onEdit,
  onRemove,
}: {
  location: LocalData;
  primary: boolean;
  onEdit: () => void;
  onRemove: () => void;
}) => (
  <article className="flex h-full flex-col rounded-sm border border-border p-3">
    <div className="flex items-start gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-(--hub-radius-control) bg-muted text-foreground">
        <Store className="size-5" strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{location.nombre}</p>
        <p className="truncate text-sm text-muted-foreground">{location.direccion || "Dirección por completar"}</p>
      </div>
      {primary && <HubStatusChip tone="success" icon={Store} label="Principal" />}
    </div>

    <dl className="mt-3 space-y-1.5 border-t border-border pt-3 text-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Phone className="size-3.5 shrink-0" />
        <dt className="sr-only">Teléfono</dt>
        <dd className="truncate">{location.telefono || "Sin teléfono"}</dd>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Clock className="size-3.5 shrink-0" />
        <dt className="sr-only">Horario</dt>
        <dd className="truncate">{location.horario || "Sin horario"}</dd>
      </div>
    </dl>

    <div className="mt-auto flex gap-1.5 pt-3">
      <button type="button" className={cn(hubButton.secondary, "flex-1")} onClick={onEdit}>
        <Pencil />
        Editar
      </button>
      <button type="button" className={hubButton.danger} onClick={onRemove} aria-label={`Quitar ${location.nombre}`}>
        <Trash2 />
      </button>
    </div>
  </article>
);

/**
 * Ubicaciones opcionales. El switch explícito evita crear una sucursal implícita;
 * cada ubicación se completa en un modal y queda como tarjeta de resumen.
 */
export const LocalStep = ({ locations, onLocationsChange, enabled, onEnabledChange }: LocalStepProps) => {
  // null = cerrado; -1 = nueva; n = editando la ubicación n.
  const [editing, setEditing] = useState<number | null>(null);

  const handleToggle = (next: boolean) => {
    onEnabledChange(next);
    if (next && locations.length === 0) setEditing(-1);
  };

  const handleCancel = () => {
    setEditing(null);
    if (locations.length === 0) onEnabledChange(false);
  };

  const handleSave = (location: LocalData) => {
    const next =
      editing === -1 || editing === null
        ? [...locations, location]
        : locations.map((item, index) => (index === editing ? location : item));
    onLocationsChange(next);
    setEditing(null);
  };

  const handleRemove = (index: number) => {
    const next = locations.filter((_, itemIndex) => itemIndex !== index);
    onLocationsChange(next);
    if (next.length === 0) onEnabledChange(false);
  };

  return (
    <section className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-medium tracking-tight">¿Quieres agregar una ubicación?</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Una ubicación puede representar una tienda, consultorio, almacén o punto de atención.
          </p>
        </div>
        <span className={cn(hubStatus, hubTone.neutral, "shrink-0")}>Opcional</span>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-sm border border-border p-3">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-(--hub-radius-control) bg-muted text-foreground">
            <MapPin className="size-5" strokeWidth={1.75} />
          </span>
          <div>
            <label htmlFor="add-location" className="text-sm font-medium">
              Agregar ubicaciones ahora
            </label>
            <p className="text-sm text-muted-foreground">Si lo omites, tu organización se creará sin sucursales.</p>
          </div>
        </div>
        <Switch id="add-location" checked={enabled} onCheckedChange={handleToggle} />
      </div>

      {enabled && locations.length > 0 && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {locations.map((location, index) => (
            <LocationCard
              key={`${location.nombre}-${index}`}
              location={location}
              primary={index === 0}
              onEdit={() => setEditing(index)}
              onRemove={() => handleRemove(index)}
            />
          ))}
          <button
            type="button"
            onClick={() => setEditing(-1)}
            className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-border p-3 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
          >
            <span className="flex size-10 items-center justify-center rounded-(--hub-radius-control) bg-muted">
              <Plus className="size-5" />
            </span>
            Agregar otra ubicación
          </button>
        </div>
      )}

      <p className="text-sm text-muted-foreground">Nada se crea hasta que confirmes el resumen.</p>

      {editing !== null && (
        <LocationDialog
          key={editing}
          open
          initial={editing >= 0 ? locations[editing] : EMPTY}
          isEditing={editing >= 0}
          onCancel={handleCancel}
          onSave={handleSave}
        />
      )}
    </section>
  );
};
