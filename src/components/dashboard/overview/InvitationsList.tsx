"use client";

import { Check, Clock3, MailOpen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

/**
 * Invitaciones pendientes del usuario.
 * TODO(0.2): leer desde `GET /invitations` y manejar aceptar/declinar.
 */
interface Invitation {
  id: string;
  orgName: string;
  invitedBy: string;
  role: string;
  expiresIn: string;
}

const INVITATIONS: Invitation[] = [
  {
    id: "inv_001",
    orgName: "La Fonda del Chef",
    invitedBy: "Lucía Torres",
    role: "Miembro",
    expiresIn: "6 días",
  },
];

export const InvitationsList = () => {
  return (
    <section aria-labelledby="invitaciones-title">
      <div className="flex items-center gap-2">
        <h2 id="invitaciones-title" className="text-base font-medium">
          Invitaciones
        </h2>
        {INVITATIONS.length > 0 && (
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
            {INVITATIONS.length}
          </span>
        )}
      </div>

      {INVITATIONS.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-border">
          <EmptyState
            icon={MailOpen}
            title="Sin invitaciones pendientes"
            description="Cuando alguien te invite a su organización, lo verás aquí."
          />
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {INVITATIONS.map((invitation) => (
            <li
              key={invitation.id}
              className="flex flex-wrap items-center justify-between gap-3 gap-y-5 rounded-xl border border-border bg-card p-4"
            >
              <div className="flex gap-3">
                <div className="flex mt-0.5 size-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                  <Clock3 className="size-4" />
                </div>
                <div>
                  <p className="text-base font-medium">{invitation.orgName}</p>
                  <p className="text-sm text-muted-foreground">
                    {invitation.invitedBy} te invitó como {invitation.role} ·
                    expira en {invitation.expiresIn}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" className="text-sm px-3 rounded-full">
                  <X /> Rechazar
                </Button>
                <Button type="button" className="text-sm px-3 rounded-full">
                  <Check /> Aceptar
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
