"use client";

import { Clock3 } from "lucide-react";
import { CompanyIcon } from "@/components/dashboard/shared/icons";
import { InvitationStatusChip } from "@/components/dashboard/invitaciones/InvitationStatusChip";
import type { Invitation } from "@/components/dashboard/invitaciones/types";

interface InvitationCardProps {
  invitation: Invitation;
  /** Solo las pendientes reciben acciones; el historial muestra su estado. */
  onAccept?: () => void;
  onDecline?: () => void;
}

export const InvitationCard = ({ invitation, onAccept, onDecline }: InvitationCardProps) => {
  const isPending = invitation.status === "PENDING";

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-border p-2">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-muted text-foreground">
          <CompanyIcon className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{invitation.orgName}</p>
          <p className="text-sm text-muted-foreground">
            {invitation.invitedBy} te invitó como{" "}
            <span className="text-foreground">{invitation.role}</span>
            {!isPending && ` · Recibida ${invitation.receivedAt}`}
          </p>
        </div>
      </div>

      {isPending ? (
        <div className="flex w-full items-center gap-1.5 sm:w-auto">
          <span className="mr-auto inline-flex h-8 items-center gap-1.5 rounded-sm bg-muted px-2.5 text-[13px] font-medium text-muted-foreground sm:mr-2">
            <Clock3 className="size-3.5" />
            Expira en {invitation.expiresIn}
          </span>
          <button
            type="button"
            onClick={onDecline}
            className="rounded-sm bg-muted px-2.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/70"
          >
            Rechazar
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="rounded-sm bg-foreground px-2.5 py-1.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Aceptar
          </button>
        </div>
      ) : (
        <InvitationStatusChip status={invitation.status} />
      )}
    </li>
  );
};
