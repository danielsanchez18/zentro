"use client";

import {
  UserRound,
  ShoppingBag,
  MapPin,
  Clock3,
  Pencil,
  Trash2,
  Building2,
  Sparkles,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import { cn } from "@/lib/utils";
import type { CrmCustomer } from "@/lib/mock/crm";

export type CustomerDetailTab =
  | "general"
  | "pedidos"
  | "direcciones"
  | "actividad";

interface CustomerHeaderProps {
  customer: CrmCustomer;
  relatedOrdersCount: number;
  activeTab: CustomerDetailTab;
  onTabChange: (tab: CustomerDetailTab) => void;
  onEdit: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
}

const initials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

export function CustomerHeader({
  customer,
  relatedOrdersCount,
  activeTab,
  onTabChange,
  onEdit,
  onToggleStatus,
  onDelete,
}: CustomerHeaderProps) {
  const KindIcon = customer.kind === "empresa" ? Building2 : UserRound;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
      {/* Banner de portada con degradado y formas geométricas modernas */}
      <div className="relative h-32 w-full overflow-hidden bg-linear-to-r from-accent via-background to-accent sm:h-44">
        {/* Formas abstractas decorativas inspiradas en Preline */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-10 -top-10 size-60 rounded-full bg-accent/50 blur-2xl" />
          <div className="absolute right-12 -bottom-8 size-52 rounded-full bg-card/40 blur-xl" />
          <div className="absolute left-1/3 top-2 size-40 rounded-full bg-card/50 blur-xl" />
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[20px_20px] opacity-15" />
        </div>

        {/* Badge flotante de fidelidad en la esquina superior derecha */}
        <div className="absolute right-4 top-4 hidden items-center gap-1.5 rounded-lg bg-accent-foreground/5 px-2.5 py-2 leading-none text-sm font-medium backdrop-blur-2xl border border-border sm:flex">
          <span>
            {customer.totalOrders >= 10
              ? "Cliente VIP"
              : customer.totalOrders >= 5
                ? "Cliente Frecuente"
                : customer.totalOrders >= 2
                  ? "Cliente Regular"
                  : "Nuevo Cliente"}
          </span>
        </div>
      </div>

      {/* Área del perfil y avatar sobrepuesto */}
      <div className="px-5 pb-4">
        <div className="-mt-12 mb-4 flex flex-col items-center justify-between gap-4 sm:-mt-10 sm:flex-row sm:items-end">
          {/* Avatar e identidad */}
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:text-left">
            <div className="relative">
              <div className="relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-card bg-muted font-bold text-2xl text-primary shadow-md ring-1 ring-border/40 sm:size-28">
                {customer.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={customer.avatar}
                    alt={customer.name}
                    className="size-full object-cover"
                  />
                ) : (
                  <span>{initials(customer.name)}</span>
                )}
              </div>

              {/* Indicador de estado */}
              <span
                className={cn(
                  "absolute bottom-1 right-1 flex size-5 items-center justify-center rounded-full border-2 border-card",
                  customer.status === "activo"
                    ? "bg-green-500 text-white"
                    : "bg-yellow-500 text-white",
                )}
                title={
                  customer.status === "activo"
                    ? "Cliente activo"
                    : "Cliente inactivo"
                }
              >
                <span className="size-1.75 rounded-full bg-white" />
              </span>
            </div>

            <div className="pt-1 sm:pt-0 sm:pb-1">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h1 className="text-xl font-medium font-heading text-foreground sm:text-2xl">
                  {customer.name}
                </h1>
                <StatusBadge status={customer.status} />
              </div>

              <div className="mt-1 flex flex-wrap items-center justify-center gap-2 text-muted-foreground sm:justify-start text-sm font-heading">
                <span className="inline-flex items-center gap-1 font-medium capitalize">
                  <KindIcon className="size-3.5 text-muted-foreground" />
                  {customer.kind === "empresa" ? "Empresa" : "Persona natural"}
                </span>
                {customer.documentNumber && (
                  <>
                    <span className="text-border">•</span>
                    <span>
                      {customer.documentType} {customer.documentNumber}
                    </span>
                  </>
                )}
                <span className="text-border">•</span>
                <span className="capitalize">
                  Canal: {customer.preferredChannel}
                </span>
              </div>
            </div>
          </div>

          {/* Acciones principales de cabecera */}
          {/* <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="gap-1.5"
            >
              <Pencil className="size-3.5" />
              Editar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleStatus}
              className={cn(
                "gap-1.5",
                customer.status === "activo"
                  ? "text-amber-500 hover:text-amber-600"
                  : "text-emerald-500 hover:text-emerald-600",
              )}
            >
              {customer.status === "activo" ? "Deshabilitar" : "Habilitar"}
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onDelete}
              className="text-muted-foreground hover:text-destructive"
              title="Eliminar cliente"
            >
              <Trash2 className="size-4" />
            </Button>
          </div> */}
        </div>

        {/* Barra de pestañas inferiores */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 font-heading">
          <button
            type="button"
            onClick={() => onTabChange("general")}
            className={cn(
              "flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-1.5 leading-none text-sm font-medium transition-colors",
              activeTab === "general"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <User className="size-4" />
            Resumen
          </button>
          <button
            type="button"
            onClick={() => onTabChange("pedidos")}
            className={cn(
              "flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-1.5 leading-none text-sm font-medium transition-colors",
              activeTab === "pedidos"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <ShoppingBag className="size-4" />
            Pedidos
          </button>
          <button
            type="button"
            onClick={() => onTabChange("direcciones")}
            className={cn(
              "flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-1.5 leading-none text-sm font-medium transition-colors",
              activeTab === "direcciones"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <MapPin className="size-4" />
            Direcciones
          </button>
          <button
            type="button"
            onClick={() => onTabChange("actividad")}
            className={cn(
              "flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-1.5 leading-none text-sm font-medium transition-colors",
              activeTab === "actividad"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Clock3 className="size-4" />
            Historial
          </button>
        </div>
      </div>
    </div>
  );
}
