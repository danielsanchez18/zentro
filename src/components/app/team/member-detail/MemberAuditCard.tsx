import { Button } from "@/components/ui/button";
import type { MemberAuditType, TeamMember } from "@/lib/mock/team";
import { Lock, UserCog, Mail, ArrowRight, Pencil } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const AUDIT_ICONS: Record<MemberAuditType, LucideIcon> = {
  rol: UserCog,
  acceso: Lock,
  invitacion: Mail,
  ingreso: ArrowRight,
  perfil: Pencil,
};

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

/** Historial operativo del miembro (auditoría). */
export const MemberAuditCard = ({ member }: { member: TeamMember }) => {
  const events = [...member.auditLog].sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime(),
  );

  return (
    <section className="max-lg:p-5 max-lg:rounded-xl max-lg:bg-card max-lg:border max-lg:border-border lg:py-3 space-y-5">
      <div className="flex items-center justify-between gap-x-5">
        <h2 className="text-base font-medium">Historial operativo</h2>
        <Button variant="outline" className="px-3">
          Último mes
        </Button>
      </div>
      <ul className="grid gap-5">
        {events.map((event) => {
          const Icon = AUDIT_ICONS[event.type];
          return (
          <li key={event.id} className="flex items-start gap-3">
            
            <span
              aria-hidden
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-sm"
            >
              <Icon className="w-4 h-4" />
            </span>

            <div>
              <h3 className="text-sm font-medium">{event.description}</h3>
              <p className="text-sm text-muted-foreground">
                {formatDateTime(event.at)} - {" "}
                <span className="font-medium">{event.actor}</span>
              </p>
            </div>
          </li>
        );})}
      </ul>
    </section>
  );
};