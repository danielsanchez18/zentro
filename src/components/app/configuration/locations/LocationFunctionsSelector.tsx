"use client";

import {
  Users,
  CreditCard,
  Package,
  PackageCheck,
  ShoppingBag,
  Truck,
  Calendar,
  Globe,
  type LucideIcon,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import { cn } from "@/lib/utils";
import {
  LOCATION_FUNCTIONS,
  type LocationFunctionKey,
} from "@/lib/mock/locations";

interface LocationFunctionsSelectorProps {
  functions: LocationFunctionKey[];
  onToggleFunction: (key: LocationFunctionKey) => void;
}

const FUNCTION_ICONS: Record<LocationFunctionKey, LucideIcon> = {
  atencion: Users,
  pos: CreditCard,
  inventario: Package,
  preparacion: PackageCheck,
  recojo: ShoppingBag,
  delivery: Truck,
  citas: Calendar,
  presencia: Globe,
};

/**
 * Selector de funciones ("¿Qué sucede aquí?") para una ubicación.
 * Presentado como cards interactivas con ícono temático, descripción, StatusBadge y switch toggle.
 */
export const LocationFunctionsSelector = ({
  functions,
  onToggleFunction,
}: LocationFunctionsSelectorProps) => {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-foreground">¿Qué sucede aquí?</p>
        <p className="text-sm font-sans text-muted-foreground mt-0.5">
          Define las actividades y operaciones habilitadas en esta sede.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {LOCATION_FUNCTIONS.map((fn) => {
          const active = functions.includes(fn.key);
          const Icon = FUNCTION_ICONS[fn.key];

          return (
            <label
              key={fn.key}
              className={cn(
                "group relative flex flex-col justify-between rounded-xl border px-4 py-3.5 cursor-pointer transition-all",
                active
                  ? ""
                  : "border-border bg-card hover:border-border/80 hover:bg-accent/20",
              )}
            >
              {/* Contenido superior: Ícono + Título + Descripción */}
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors bg-accent",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <Icon className="size-4.5" />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {fn.label}
                  </p>
                  <p className="text-xs text-muted-foreground font-sans">
                    {fn.description}
                  </p>
                </div>
              </div>

              {/* Pie de tarjeta: StatusBadge y Switch */}
              <div className="mt-3.5 flex items-center justify-between border-t border-border/50 pt-2.5">
                <StatusBadge
                  status={active ? "activo" : "inactivo"}
                  label={active ? "Habilitado" : "Deshabilitado"}
                />

                <Switch
                  checked={active}
                  onCheckedChange={() => onToggleFunction(fn.key)}
                />
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
};
