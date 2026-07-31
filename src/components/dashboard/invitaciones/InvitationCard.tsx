"use client";

import { Check, Clock3, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Invitation } from "@/components/dashboard/invitaciones/types";

export const InvitationCard = ({ invitation }: { invitation: Invitation }) => {
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
      <div className="flex gap-3">
        <div className="flex mt-0.5 size-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
          <Clock3 className="size-4" />
        </div>
        <div>
          <p className="text-base font-medium">{invitation.orgName}</p>
          <p className="text-sm text-muted-foreground">
            {invitation.invitedBy} te invitó como{" "}
            <span className="font-medium text-foreground">
              {invitation.role}
            </span>{" "}
            · expira en {invitation.expiresIn}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" className="px-3 rounded-full text-sm">
          <X /> Rechazar
        </Button>
        <Button type="button" className="px-3 rounded-full text-sm">
          <Check /> Aceptar
        </Button>
      </div>
    </li>
  );
};
