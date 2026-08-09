import type { MemberAuditType, TeamMember } from "@/lib/mock/team";

const AUDIT_ICONS: Record<MemberAuditType, string> = {
  rol: "👤",
  acceso: "🔒",
  invitacion: "✉️",
  ingreso: "➡️",
  perfil: "✏️",
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
    <section className="rounded-xl border border-border bg-card p-5 font-heading lg:col-span-1">
      <h2 className="text-sm font-semibold text-primary">Auditoría</h2>
      <ul className="mt-4 space-y-4 border-t border-border pt-4">
        {events.map((event) => (
          <li key={event.id} className="flex items-start gap-3">
            <span
              aria-hidden
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-sm"
            >
              {AUDIT_ICONS[event.type]}
            </span>
            <div>
              <p className="text-sm font-medium">{event.description}</p>
              <p className="text-xs text-muted-foreground">
                {formatDateTime(event.at)} ·{" "}
                <span className="font-medium">{event.actor}</span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};