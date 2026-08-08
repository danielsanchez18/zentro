"use client";

import { BadgeCheck, Ban, CheckCircle2, Clock3, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MemberStatus } from "@/lib/mock/team";

/**
 * Configuración visual por estado 🎨.
 *
 * Para estilizar un estado basta con tocar esta tabla:
 * - `badge`      → clases del contenedor (fondo, texto, anillo).
 * - `iconClass`  → clases solo del ícono (tint del ícono).
 * - `icon`       → icono lucide que lo representa.
 *
 * Los estados y su semántica:
 * - activo        → verde / check → acceso operativo.
 * - invitado      → ámbar / reloj → pendiente de aceptar.
 * - deshabilitado → neutro / prohibido → acceso revocado.
 */
const STATUS_CONFIG: Record<
  MemberStatus,
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
};

interface StatusBadgeProps {
  status: MemberStatus;
}

/**
 * Badge de estado para la columna «Estado» de la tabla de Equipo.
 * Reemplaza al chip plano: cada estado lleva su propio ícono y paleta de color.
 */
export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const { label, icon: Icon, badge, iconClass } = STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-lg px-2.5 py-2 text-[13px] font-medium font-heading",
        badge,
      )}
    >
      <Icon className={cn("size-3.5 shrink-0", iconClass)} />
      <p className="leading-none">{label}</p>
    </span>
  );
};