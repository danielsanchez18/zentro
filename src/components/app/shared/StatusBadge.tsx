"use client";

import {
  ArrowDownToLine,
  ArrowUpFromLine,
  BadgeCheck,
  Ban,
  CalendarClock,
  CircleSlash2,
  CheckCheck,
  CheckCircle2,
  Clock3,
  FilePenLine,
  Hourglass,
  PackageCheck,
  PackageX,
  PauseCircle,
  Send,
  SlidersHorizontal,
  TriangleAlert,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { MemberStatus, InvitationStatus } from "@/lib/mock/team";

/** Estados soportados: miembros, invitaciones y catálogo. */
export type BadgeStatus =
  | MemberStatus
  | InvitationStatus
  | "activo"
  | "inactivo"
  | "disponible"
  | "ocupado"
  | "reservado"
  | "bajo"
  | "agotado"
  | "entrada"
  | "salida"
  | "merma"
  | "ajuste"
  | "borrador"
  | "enviada"
  | "parcial"
  | "recibida"
  | "cancelada"
  | "completado"
  | "programada"
  | "activa"
  | "pausada"
  | "finalizada"
  | "nuevo"
  | "confirmado"
  | "en_preparacion"
  | "listo"
  | "entregado"
  | "cancelado"
  | "pago_pendiente"
  | "pago_parcial"
  | "pagado"
  | "reembolsado";

/**
 * Configuración visual por estado 🎨.
 *
 * Para estilizar un estado basta con tocar esta tabla:
 * - `badge`      → clases del contenedor (fondo, texto, anillo).
 * - `iconClass`  → clases solo del ícono (tint del ícono).
 * - `icon`       → icono lucide que lo representa.
 *
 * Estados de miembros:
 * - activo        → verde / check → acceso operativo.
 * - invitado      → ámbar / reloj → pendiente de aceptar.
 * - deshabilitado → rojo / prohibido → acceso revocado.
 *
 * Estados de invitación (ciclo de vida):
 * - PENDING  → ámbar / reloj → esperando aceptación.
 * - ACCEPTED → verde / check → el invitado ya es miembro.
 * - DECLINED → rojo / cruz  → el invitado rechazó.
 * - EXPIRED  → gris / reloj de arena → venció el enlace (7 días).
 * - REVOKED  → gris / prohibido → el enlace se revocó antes de usarse.
 */
const STATUS_CONFIG: Record<
  BadgeStatus,
  {
    label: string;
    icon: LucideIcon;
    badge: string;
    iconClass: string;
  }
> = {
  activo: {
    label: "Activo",
    icon: BadgeCheck,
    badge:
      "bg-green-500/10 text-green-600 ring-green-500/25 dark:bg-green-800/15 dark:text-green-500",
    iconClass: "text-green-600 dark:text-green-500",
  },
  invitado: {
    label: "Pendiente",
    icon: Clock3,
    badge:
      "bg-yellow-500/10 text-yellow-600 ring-yellow-500/25 dark:bg-yellow-500/15 dark:text-yellow-400 dark:ring-yellow-400/20",
    iconClass: "text-yellow-600 dark:text-yellow-400",
  },
  deshabilitado: {
    label: "Deshabilitado",
    icon: Ban,
    badge:
      "bg-rose-500/10 text-rose-600 ring-rose-500/25 dark:bg-rose-800/15 dark:text-rose-400",
    iconClass: "text-rose-600 dark:text-rose-400",
  },
  PENDING: {
    label: "Pendiente",
    icon: Clock3,
    badge:
      "bg-yellow-500/10 text-yellow-600 ring-yellow-500/25 dark:bg-yellow-500/15 dark:text-yellow-400 dark:ring-yellow-400/20",
    iconClass: "text-yellow-600 dark:text-yellow-400",
  },
  ACCEPTED: {
    label: "Aceptada",
    icon: CheckCheck,
    badge:
      "bg-emerald-500/10 text-emerald-600 ring-emerald-500/25 dark:bg-emerald-800/15 dark:text-emerald-400",
    iconClass: "text-emerald-600 dark:text-emerald-400",
  },
  DECLINED: {
    label: "Rechazada",
    icon: XCircle,
    badge:
      "bg-rose-500/10 text-rose-600 ring-rose-500/25 dark:bg-rose-800/15 dark:text-rose-400",
    iconClass: "text-rose-600 dark:text-rose-400",
  },
  EXPIRED: {
    label: "Expirada",
    icon: Hourglass,
    badge:
      "bg-neutral-500/10 text-neutral-800 ring-neutral-500 dark:bg-neutral-800 dark:text-neutral-300",
    iconClass: "text-neutral-800 dark:text-neutral-300",
  },
  REVOKED: {
    label: "Revocada",
    icon: Ban,
    badge:
      "bg-neutral-500/10 text-neutral-800 ring-neutral-500 dark:bg-neutral-800 dark:text-neutral-300",
    iconClass: "text-neutral-800 dark:text-neutral-300",
  },
  inactivo: {
    label: "Inactivo",
    icon: Ban,
    badge:
      "bg-neutral-500/10 text-neutral-800 ring-neutral-500 dark:bg-neutral-800 dark:text-neutral-300",
    iconClass: "text-neutral-800 dark:text-neutral-300",
  },
  disponible: {
    label: "Disponible",
    icon: CheckCircle2,
    badge:
      "bg-emerald-500/10 text-emerald-600 ring-emerald-500/25 dark:bg-emerald-800/15 dark:text-emerald-400",
    iconClass: "text-emerald-600 dark:text-emerald-400",
  },
  ocupado: {
    label: "Ocupado",
    icon: Clock3,
    badge:
      "bg-amber-500/10 text-amber-600 ring-amber-500/25 dark:bg-amber-500/15 dark:text-amber-400 dark:ring-amber-400/20",
    iconClass: "text-amber-600 dark:text-amber-400",
  },
  reservado: {
    label: "Reservado",
    icon: CalendarClock,
    badge:
      "bg-sky-500/10 text-sky-600 ring-sky-500/25 dark:bg-sky-800/15 dark:text-sky-400",
    iconClass: "text-sky-600 dark:text-sky-400",
  },
  bajo: {
    label: "Stock bajo",
    icon: TriangleAlert,
    badge:
      "bg-yellow-500/10 text-yellow-600 ring-yellow-500/25 dark:bg-yellow-500/15 dark:text-yellow-400 dark:ring-yellow-400/20",
    iconClass: "text-yellow-600 dark:text-yellow-400",
  },
  agotado: {
    label: "Agotado",
    icon: PackageX,
    badge:
      "bg-rose-500/10 text-rose-600 ring-rose-500/25 dark:bg-rose-800/15 dark:text-rose-400",
    iconClass: "text-rose-600 dark:text-rose-400",
  },
  entrada: {
    label: "Entrada",
    icon: ArrowDownToLine,
    badge:
      "bg-emerald-500/10 text-emerald-600 ring-emerald-500/25 dark:bg-emerald-800/15 dark:text-emerald-400",
    iconClass: "text-emerald-600 dark:text-emerald-400",
  },
  salida: {
    label: "Salida",
    icon: ArrowUpFromLine,
    badge:
      "bg-sky-500/10 text-sky-600 ring-sky-500/25 dark:bg-sky-800/15 dark:text-sky-400",
    iconClass: "text-sky-600 dark:text-sky-400",
  },
  merma: {
    label: "Merma",
    icon: PackageX,
    badge:
      "bg-rose-500/10 text-rose-600 ring-rose-500/25 dark:bg-rose-800/15 dark:text-rose-400",
    iconClass: "text-rose-600 dark:text-rose-400",
  },
  ajuste: {
    label: "Ajuste",
    icon: SlidersHorizontal,
    badge:
      "bg-yellow-500/10 text-yellow-600 ring-yellow-500/25 dark:bg-yellow-500/15 dark:text-yellow-400 dark:ring-yellow-400/20",
    iconClass: "text-yellow-600 dark:text-yellow-400",
  },
  borrador: {
    label: "Borrador",
    icon: FilePenLine,
    badge:
      "bg-neutral-500/10 text-neutral-700 ring-neutral-500/25 dark:bg-neutral-800/50 dark:text-neutral-300",
    iconClass: "text-neutral-600 dark:text-neutral-400",
  },
  enviada: {
    label: "Enviada",
    icon: Send,
    badge:
      "bg-sky-500/10 text-sky-600 ring-sky-500/25 dark:bg-sky-800/15 dark:text-sky-400",
    iconClass: "text-sky-600 dark:text-sky-400",
  },
  parcial: {
    label: "Recepción parcial",
    icon: Clock3,
    badge:
      "bg-yellow-500/10 text-yellow-600 ring-yellow-500/25 dark:bg-yellow-500/15 dark:text-yellow-400",
    iconClass: "text-yellow-600 dark:text-yellow-400",
  },
  recibida: {
    label: "Recibida",
    icon: PackageCheck,
    badge:
      "bg-emerald-500/10 text-emerald-600 ring-emerald-500/25 dark:bg-emerald-800/15 dark:text-emerald-400",
    iconClass: "text-emerald-600 dark:text-emerald-400",
  },
  cancelada: {
    label: "Cancelada",
    icon: CircleSlash2,
    badge:
      "bg-rose-500/10 text-rose-600 ring-rose-500/25 dark:bg-rose-800/15 dark:text-rose-400",
    iconClass: "text-rose-600 dark:text-rose-400",
  },
  programada: {
    label: "Programada",
    icon: CalendarClock,
    badge:
      "bg-sky-500/10 text-sky-600 ring-sky-500/25 dark:bg-sky-800/15 dark:text-sky-400",
    iconClass: "text-sky-600 dark:text-sky-400",
  },
  activa: {
    label: "Activa",
    icon: BadgeCheck,
    badge:
      "bg-emerald-500/10 text-emerald-600 ring-emerald-500/25 dark:bg-emerald-800/15 dark:text-emerald-400",
    iconClass: "text-emerald-600 dark:text-emerald-400",
  },
  pausada: {
    label: "Pausada",
    icon: PauseCircle,
    badge:
      "bg-yellow-500/10 text-yellow-600 ring-yellow-500/25 dark:bg-yellow-500/15 dark:text-yellow-400",
    iconClass: "text-yellow-600 dark:text-yellow-400",
  },
  finalizada: {
    label: "Finalizada",
    icon: CheckCheck,
    badge:
      "bg-neutral-500/10 text-neutral-700 ring-neutral-500/25 dark:bg-neutral-800/50 dark:text-neutral-300",
    iconClass: "text-neutral-600 dark:text-neutral-400",
  },
  completado: {
    label: "Completado",
    icon: BadgeCheck,
    badge:
      "bg-emerald-500/10 text-emerald-600 ring-emerald-500/25 dark:bg-emerald-800/15 dark:text-emerald-400",
    iconClass: "text-emerald-600 dark:text-emerald-400",
  },
  nuevo: {
    label: "Nuevo",
    icon: Clock3,
    badge:
      "bg-sky-500/10 text-sky-600 ring-sky-500/25 dark:bg-sky-800/15 dark:text-sky-400",
    iconClass: "text-sky-600 dark:text-sky-400",
  },
  confirmado: {
    label: "Confirmado",
    icon: CheckCircle2,
    badge:
      "bg-indigo-500/10 text-indigo-600 ring-indigo-500/25 dark:bg-indigo-800/15 dark:text-indigo-400",
    iconClass: "text-indigo-600 dark:text-indigo-400",
  },
  en_preparacion: {
    label: "En preparación",
    icon: Hourglass,
    badge:
      "bg-yellow-500/10 text-yellow-600 ring-yellow-500/25 dark:bg-yellow-500/15 dark:text-yellow-400",
    iconClass: "text-yellow-600 dark:text-yellow-400",
  },
  listo: {
    label: "Listo",
    icon: PackageCheck,
    badge:
      "bg-violet-500/10 text-violet-600 ring-violet-500/25 dark:bg-violet-800/15 dark:text-violet-400",
    iconClass: "text-violet-600 dark:text-violet-400",
  },
  entregado: {
    label: "Entregado",
    icon: CheckCheck,
    badge:
      "bg-emerald-500/10 text-emerald-600 ring-emerald-500/25 dark:bg-emerald-800/15 dark:text-emerald-400",
    iconClass: "text-emerald-600 dark:text-emerald-400",
  },
  cancelado: {
    label: "Cancelado",
    icon: CircleSlash2,
    badge:
      "bg-rose-500/10 text-rose-600 ring-rose-500/25 dark:bg-rose-800/15 dark:text-rose-400",
    iconClass: "text-rose-600 dark:text-rose-400",
  },
  pago_pendiente: {
    label: "Pago pendiente",
    icon: Clock3,
    badge:
      "bg-yellow-500/10 text-yellow-600 ring-yellow-500/25 dark:bg-yellow-500/15 dark:text-yellow-400",
    iconClass: "text-yellow-600 dark:text-yellow-400",
  },
  pago_parcial: {
    label: "Pago parcial",
    icon: Clock3,
    badge:
      "bg-orange-500/10 text-orange-600 ring-orange-500/25 dark:bg-orange-800/15 dark:text-orange-400",
    iconClass: "text-orange-600 dark:text-orange-400",
  },
  pagado: {
    label: "Pagado",
    icon: BadgeCheck,
    badge:
      "bg-emerald-500/10 text-emerald-600 ring-emerald-500/25 dark:bg-emerald-800/15 dark:text-emerald-400",
    iconClass: "text-emerald-600 dark:text-emerald-400",
  },
  reembolsado: {
    label: "Reembolsado",
    icon: ArrowUpFromLine,
    badge:
      "bg-neutral-500/10 text-neutral-700 ring-neutral-500/25 dark:bg-neutral-800/50 dark:text-neutral-300",
    iconClass: "text-neutral-600 dark:text-neutral-400",
  },
};

interface StatusBadgeProps {
  status: BadgeStatus;
  label?: string;
  className?: string;
}

/**
 * Badge de estado reutilizable para el módulo Equipo.
 * Reemplaza al chip plano: cada estado lleva su propio ícono y paleta de color.
 * Soporta estados de miembros y estados del ciclo de vida de invitaciones.
 */
export const StatusBadge = ({
  status,
  label: customLabel,
  className,
}: StatusBadgeProps) => {
  const config = STATUS_CONFIG[status];
  if (!config) return null;
  const { label, icon: Icon, badge, iconClass } = config;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-nowrap rounded-lg px-2.5 py-2 text-[13px] font-medium font-heading",
        badge,
        className,
      )}
    >
      <Icon className={cn("size-3.5 shrink-0", iconClass)} />
      <p className="leading-none text-nowrap">{customLabel ?? label}</p>
    </span>
  );
};
