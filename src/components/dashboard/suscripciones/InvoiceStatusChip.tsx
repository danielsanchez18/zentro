import { type HubTone } from "@/components/dashboard/shared/styles";
import { HubStatusChip } from "@/components/dashboard/shared/HubStatusChip";
import type { InvoiceStatus } from "@/components/dashboard/suscripciones/types";

const STATUS: Record<InvoiceStatus, { label: string; tone: HubTone }> = {
  PAID: { label: "Pagada", tone: "success" },
  OPEN: { label: "Pendiente", tone: "warning" },
  VOID: { label: "Anulada", tone: "neutral" },
};

export const InvoiceStatusChip = ({ status }: { status: InvoiceStatus }) => {
  const { label, tone } = STATUS[status];
  return <HubStatusChip tone={tone} label={label} />;
};
