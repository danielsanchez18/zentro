import { type HubTone } from "@/components/dashboard/shared/styles";
import { HubStatusChip } from "@/components/dashboard/shared/HubStatusChip";
import type { InvitationStatus } from "@/components/dashboard/invitaciones/types";

const STATUS: Record<InvitationStatus, { label: string; tone: HubTone }> = {
  PENDING: { label: "Pendiente", tone: "warning" },
  ACCEPTED: { label: "Aceptada", tone: "success" },
  DECLINED: { label: "Rechazada", tone: "neutral" },
  EXPIRED: { label: "Expirada", tone: "warning" },
  REVOKED: { label: "Revocada", tone: "neutral" },
};

export const InvitationStatusChip = ({ status }: { status: InvitationStatus }) => {
  const { label, tone } = STATUS[status];
  return <HubStatusChip tone={tone} label={label} />;
};
