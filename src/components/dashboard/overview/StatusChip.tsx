
import type { SubscriptionStatus } from "@/types/dashboard";
import { type HubTone } from "@/components/dashboard/shared/styles";
import { HubStatusChip } from "@/components/dashboard/shared/HubStatusChip";

export type { SubscriptionStatus } from "@/types/dashboard";

const STATUS: Record<SubscriptionStatus, { label: string; tone: HubTone }> = {
  TRIAL: { label: "Trial", tone: "info" },
  ACTIVE: { label: "Activa", tone: "success" },
  PAST_DUE: { label: "Atrasada", tone: "warning" },
  CANCELED: { label: "Cancelada", tone: "neutral" },
};

export const StatusChip = ({ status }: { status: SubscriptionStatus }) => {
  const { label, tone } = STATUS[status];
  return <HubStatusChip tone={tone} label={label} />;
};
