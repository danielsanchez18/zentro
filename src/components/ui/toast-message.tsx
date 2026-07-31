"use client";

import { toast } from "sonner";
import {
  BadgeAlert,
  BadgeCheck,
  BadgeX,
  Info,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Tipos y configuración por tipo de toast                             */
/* ------------------------------------------------------------------ */

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastContent {
  title: string;
  description?: string;
}

interface ToastVariant {
  icon: LucideIcon;
  iconClassName: string;
}

const TOAST_VARIANTS: Record<ToastType, ToastVariant> = {
  success: {
    icon: BadgeCheck,
    iconClassName: "text-emerald-600 dark:text-emerald-400",
  },
  error: {
    icon: BadgeX,
    iconClassName: "text-red-600 dark:text-red-400",
  },
  warning: {
    icon: BadgeAlert,
    iconClassName: "text-amber-600 dark:text-amber-400",
  },
  info: {
    icon: Info,
    iconClassName: "text-sky-600 dark:text-sky-400",
  },
};

/* ------------------------------------------------------------------ */
/* Componente base — tu <div> personalizado                            */
/* ------------------------------------------------------------------ */

interface AppToastProps extends ToastContent {
  type: ToastType;
}

/**
 * Estructura visual del toast. El fondo usa tokens del tema
 * (bg-popover / border-border) para que combine en dark y light.
 */
export function AppToast({ type, title, description }: AppToastProps) {
  const { icon: Icon, iconClassName } = TOAST_VARIANTS[type];

  return (
    <div className="flex items-start gap-3 px-4 py-3 border border-border rounded-lg font-sans min-w-0 w-xs max-w-md">
      <span
        className={`mt-0.5 shrink-0 ${iconClassName}`}
        aria-hidden="true"
      >
        <Icon className="size-5" />
      </span>

      <div className="flex flex-col gap-1 min-w-0">
        <p className="text-sm font-medium font-heading text-popover-foreground leading-snug">
          {title}
        </p>
        {description && (
          <p className="text-sm text-muted-foreground leading-snug">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Componentes por tipo (para usarlos directo con toast.custom)        */
/* ------------------------------------------------------------------ */

export function SuccessToast(props: ToastContent) {
  return <AppToast type="success" {...props} />;
}

export function ErrorToast(props: ToastContent) {
  return <AppToast type="error" {...props} />;
}

export function WarningToast(props: ToastContent) {
  return <AppToast type="warning" {...props} />;
}

export function InfoToast(props: ToastContent) {
  return <AppToast type="info" {...props} />;
}

/* ------------------------------------------------------------------ */
/* Helpers — la forma más cómoda de lanzar un toast                    */
/* ------------------------------------------------------------------ */

function show(type: ToastType, content: ToastContent, duration?: number) {
  toast.custom(() => <AppToast type={type} {...content} />, {
    duration: duration ?? 4000,
  });
}

export const showSuccess = (
  title: string,
  description?: string,
  duration?: number
) => show("success", { title, description }, duration);

export const showError = (
  title: string,
  description?: string,
  duration?: number
) => show("error", { title, description }, duration);

export const showWarning = (
  title: string,
  description?: string,
  duration?: number
) => show("warning", { title, description }, duration);

export const showInfo = (
  title: string,
  description?: string,
  duration?: number
) => show("info", { title, description }, duration);

/* ------------------------------------------------------------------ */
/* API única para llamadas rápidas: toastMsg.success("...")            */
/* ------------------------------------------------------------------ */

export const toastMsg = {
  success: showSuccess,
  error: showError,
  warning: showWarning,
  info: showInfo,
};
