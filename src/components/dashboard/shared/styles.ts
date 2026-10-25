/**
 * Medidas únicas de los controles del Hub. Usa estas clases en lugar de
 * escribir padding/altura a mano, para que botones, chips y pestañas
 * tengan siempre el mismo tamaño.
 *
 * - Controles: h-8, radio de control (8px), texto sm.
 * - Chips de estado/info: h-8, px-2.5, texto 13px.
 * - Pestañas: h-7 dentro de un contenedor bg-muted p-1.
 */
const control =
  "inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-(--hub-radius-control) px-3 text-sm font-medium whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4";

export const hubButton = {
  primary: `${control} bg-hub-accent text-hub-accent-foreground hover:bg-hub-accent/85`,
  secondary: `${control} bg-muted text-foreground hover:bg-muted/70`,
  ghost: `${control} text-muted-foreground hover:bg-muted hover:text-foreground`,
  danger: `${control} bg-muted text-destructive hover:bg-destructive/10`,
};

export const hubChip =
  "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-(--hub-radius-control) px-2.5 text-[13px] font-medium whitespace-nowrap [&_svg]:size-3.5";

/**
 * Tonos de estado: borde, fondo y texto del mismo color.
 * Úsalos siempre junto a `hubStatus` para chips de estado.
 */
export const hubTone = {
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  info: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-400",
  danger: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400",
  neutral: "border-border bg-muted text-muted-foreground",
} as const;

export type HubTone = keyof typeof hubTone;

/** Chip de estado: mismo tamaño que hubChip, con borde. Úsalo vía <HubStatusChip>. */
export const hubStatus = `${hubChip} border`;

export const hubTabs = {
  list: "flex w-fit max-w-full gap-1 overflow-x-auto rounded-(--hub-radius-control) bg-muted p-1",
  tab: "inline-flex h-7 shrink-0 items-center gap-1.5 rounded-(--hub-radius-inner) px-2.5 text-sm font-medium whitespace-nowrap transition-colors [&_svg]:size-4",
  active: "bg-card text-foreground shadow-xs",
  idle: "text-muted-foreground hover:text-foreground",
};

/** Fila de menú dentro de drawers (móvil). */
export const hubMenuItem =
  "flex h-11 w-full items-center gap-3 rounded-(--hub-radius-control) px-3 text-sm font-medium transition-colors hover:bg-muted [&_svg]:size-5";
