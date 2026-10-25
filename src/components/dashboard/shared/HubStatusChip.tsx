import { CircleAlert, CircleCheck, CircleMinus, Clock3, Sparkles, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { hubStatus, hubTone, type HubTone } from "@/components/dashboard/shared/styles";

/** Icono por defecto de cada tono; se puede reemplazar con `icon`. */
const TONE_ICON: Record<HubTone, LucideIcon> = {
  success: CircleCheck,
  warning: Clock3,
  info: Sparkles,
  danger: CircleAlert,
  neutral: CircleMinus,
};

interface HubStatusChipProps {
  tone: HubTone;
  label: string;
  icon?: LucideIcon;
  className?: string;
}

/** Chip de estado único del Hub: tono + icono + texto, mismo tamaño en todas partes. */
export const HubStatusChip = ({ tone, label, icon, className }: HubStatusChipProps) => {
  const Icon = icon ?? TONE_ICON[tone];
  return (
    <span className={cn(hubStatus, hubTone[tone], className)}>
      <Icon aria-hidden="true" />
      {label}
    </span>
  );
};
