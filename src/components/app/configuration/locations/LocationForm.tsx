"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Globe, MapPin, Star, CheckCircle2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  type LocationFunctionKey,
  type WorkspaceLocation,
} from "@/lib/mock/locations";
import type { UpsertLocationInput } from "@/stores/locations-store";
import { FormSection, configInputClass } from "../shared/FormSection";
import { LocationFunctionsSelector } from "./LocationFunctionsSelector";

const DEFAULT_FUNCTIONS: LocationFunctionKey[] = ["atencion", "pos"];

export interface LocationFormProps {
  id: string;
  initial?: WorkspaceLocation | null;
  mode: "create" | "edit";
  organizationId: string;
  onDirtyChange?: (isDirty: boolean) => void;
  onSubmit: (data: UpsertLocationInput) => void;
}

/**
 * Formulario completo de sede/ubicación (estilo formulario grande de Zentro).
 * Disposición en 2 columnas: Información y funciones a la izquierda;
 * estado, sede principal y ficha pública a la derecha (sticky).
 */
export function LocationForm({
  id,
  initial,
  mode,
  organizationId,
  onDirtyChange,
  onSubmit,
}: LocationFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [address, setAddress] = useState(initial?.address ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [openingHours, setOpeningHours] = useState(initial?.openingHours ?? "");
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">(
    initial?.status ?? "ACTIVE",
  );
  const [isPrimary, setIsPrimary] = useState(initial?.isPrimary ?? false);
  const [functions, setFunctions] = useState<LocationFunctionKey[]>(
    initial?.functions ?? DEFAULT_FUNCTIONS,
  );
  const [published, setPublished] = useState(
    initial?.publicProfile.published ?? false,
  );
  const [headline, setHeadline] = useState(
    initial?.publicProfile.headline ?? "",
  );
  const [description, setDescription] = useState(
    initial?.publicProfile.description ?? "",
  );
  const [touched, setTouched] = useState(false);

  // Detección de cambios contra el estado inicial
  const isDirty = useMemo(() => {
    if (mode === "create") {
      return name.trim().length > 0 || address.trim().length > 0;
    }

    if (!initial) return false;

    if (name.trim() !== (initial.name ?? "").trim()) return true;
    if (address.trim() !== (initial.address ?? "").trim()) return true;
    if (phone.trim() !== (initial.phone ?? "").trim()) return true;
    if (openingHours.trim() !== (initial.openingHours ?? "").trim())
      return true;
    if (status !== initial.status) return true;
    if (isPrimary !== initial.isPrimary) return true;

    // Funciones
    const initialFunctions = initial.functions ?? [];
    if (functions.length !== initialFunctions.length) return true;
    if (functions.some((fn) => !initialFunctions.includes(fn))) return true;

    // Presencia pública
    const initialPub = initial.publicProfile;
    if (published !== initialPub.published) return true;
    if (headline.trim() !== (initialPub.headline ?? "").trim()) return true;
    if (description.trim() !== (initialPub.description ?? "").trim())
      return true;

    return false;
  }, [
    mode,
    initial,
    name,
    address,
    phone,
    openingHours,
    status,
    isPrimary,
    functions,
    published,
    headline,
    description,
  ]);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const toggleFunction = (key: LocationFunctionKey) => {
    setFunctions((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key],
    );
  };

  const nameValid = name.trim().length >= 2;
  const showError = touched && !nameValid;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nameValid) {
      setTouched(true);
      return;
    }

    onSubmit({
      id: initial?.id,
      organizationId,
      name: name.trim(),
      address: address.trim() || null,
      phone: phone.trim() || null,
      openingHours: openingHours.trim() || null,
      status,
      isPrimary,
      functions,
      published,
      headline: headline.trim() || null,
      description: description.trim() || null,
    });
  };

  return (
    <form
      id={id}
      onSubmit={handleSubmit}
      className="grid xl:grid-cols-[1.5fr_1fr] gap-5 relative font-heading"
    >
      {/* Columna Izquierda: Información general y Funciones */}
      <div className="flex flex-col gap-5">
        {/* Información general */}
        <FormSection title="Información de la sede">
          <div className="grid gap-5">
            <div className="flex flex-col gap-y-2">
              <label className="text-sm font-medium text-foreground">
                Nombre de la sede <span className="text-destructive">*</span>
              </label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Sede Centro, Almacén Miraflores"
                maxLength={60}
                className={configInputClass}
              />
              {showError && (
                <p className="text-xs text-destructive">
                  Escribe un nombre de al menos 2 caracteres.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-y-2">
              <label className="text-sm font-medium text-foreground">
                Dirección física
              </label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ej. Av. Larco 123, Miraflores, Lima"
                maxLength={120}
                className={configInputClass}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-y-2">
                <label className="text-sm font-medium text-foreground">
                  Teléfono de contacto
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ej. +51 987 654 321"
                  maxLength={30}
                  className={configInputClass}
                />
              </div>

              <div className="flex flex-col gap-y-2">
                <label className="text-sm font-medium text-foreground">
                  Horario de atención
                </label>
                <input
                  value={openingHours}
                  onChange={(e) => setOpeningHours(e.target.value)}
                  placeholder="Ej. Lun–Sáb 9:00–18:00"
                  maxLength={50}
                  className={configInputClass}
                />
              </div>
            </div>
          </div>
        </FormSection>

        {/* Funciones operativas ("¿Qué sucede aquí?") */}
        <FormSection title="Funciones operativas">
          <LocationFunctionsSelector
            functions={functions}
            onToggleFunction={toggleFunction}
          />
        </FormSection>
      </div>

      {/* Columna Derecha: Configuración y Presencia (Sticky) */}
      <div className="flex flex-col gap-5 sticky top-5 h-fit">
        {/* Configuración de sede */}
        <FormSection title="Configuración de sede">
          <div className="space-y-4 divide-y divide-border">
            {/* Ubicación principal */}
            <label className="flex cursor-pointer items-start justify-between gap-3 pb-4">
              <div className="flex items-start gap-2.5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-primary mt-0.5">
                  <Star className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Sede principal
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Es la sede predeterminada y representativa de la empresa.
                  </p>
                </div>
              </div>
              <Switch checked={isPrimary} onCheckedChange={setIsPrimary} />
            </label>

            {/* Sede activa */}
            <label className="flex cursor-pointer items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-primary mt-0.5">
                  <CheckCircle2 className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Sede activa
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Habilitada para atención, inventario y emisión de ventas.
                  </p>
                </div>
              </div>
              <Switch
                checked={status === "ACTIVE"}
                onCheckedChange={(v) => setStatus(v ? "ACTIVE" : "INACTIVE")}
              />
            </label>
          </div>
        </FormSection>

        {/* Ficha pública online */}
        <FormSection title="Presencia online">
          <div className="space-y-4">
            <label className="flex cursor-pointer items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-primary mt-0.5">
                  <Globe className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Ficha pública en catálogo
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Muestra esta ubicación en el catálogo y portal web para tus
                    clientes.
                  </p>
                </div>
              </div>
              <Switch checked={published} onCheckedChange={setPublished} />
            </label>

            {published && (
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex flex-col gap-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Título público
                  </label>
                  <input
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="Ej. Sede Centro — Atención y Delivery"
                    maxLength={70}
                    className={configInputClass}
                  />
                </div>

                <div className="flex flex-col gap-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Descripción para clientes
                  </label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe puntos de referencia, facilidades de acceso o estacionamiento…"
                    rows={3}
                    maxLength={200}
                    className="rounded-lg border-input bg-background text-sm resize-none"
                  />
                </div>
              </div>
            )}
          </div>
        </FormSection>
      </div>
    </form>
  );
}
