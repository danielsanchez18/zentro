import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { teamMembers, type MemberAuditType, type TeamMember } from "@/lib/mock/team";
import { LastSeenChip, StatusChip } from "@/components/app/team/Table";

const AUDIT_ICONS: Record<MemberAuditType, string> = {
  rol: "👤",
  acceso: "🔒",
  invitacion: "✉️",
  ingreso: "➡️",
  perfil: "✏️",
};

const formatDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("es-CL", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Nunca";

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-start justify-between gap-3">
    <dt className="text-xs uppercase tracking-wide text-muted-foreground pt-0.5 whitespace-nowrap">
      {label}
    </dt>
    <dd className="text-sm font-medium text-end break-all">{children}</dd>
  </div>
);

export default async function MemberDetailPage({
  params,
}: {
  params: Promise<{ slug: string; memberId: string }>;
}) {
  const { slug, memberId } = await params;
  const member: TeamMember | undefined = teamMembers.find((m) => m.id === memberId);

  if (!member) {
    return (
      <div className="w-full px-5 md:px-7 xl:px-10 py-7">
        <Link
          href={`/app/${slug}/equipo`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> Volver a Equipo
        </Link>
        <div className="mt-6 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No encontramos a este integrante.
        </div>
      </div>
    );
  }

  const events = [...member.auditLog].sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime(),
  );

  return (
    <div className="w-full px-5 md:px-7 xl:px-10 py-7">
      <Link
        href={`/app/${slug}/equipo`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Volver a Equipo
      </Link>

      {/* Cabecera del miembro */}
      <section className="mt-5 flex flex-col gap-5 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-accent flex h-16 w-16 items-center justify-center overflow-hidden rounded-full">
            <span className="text-xl font-semibold text-muted-foreground">
              {member.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </span>
          </div>
          <div>
            <h1 className="font-heading text-xl font-semibold">{member.name}</h1>
            <p className="text-sm text-muted-foreground">{member.email}</p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="inline-flex rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
                {member.role}
              </span>
              <StatusChip status={member.status} />
              <LastSeenChip lastSeen={member.lastSeen} />
            </div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Se unió a la organización el{" "}
          <span className="font-medium text-foreground">
            {formatDate(member.addedAt)}
          </span>
        </div>
      </section>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {/* Datos de contacto */}
        <section className="rounded-xl border border-border bg-card p-5 font-heading lg:col-span-1">
          <h2 className="text-sm font-semibold text-primary">Contacto</h2>
          <dl className="mt-4 grid gap-3 border-t border-border pt-4">
            <Field label="Nombre">{member.name}</Field>
            <Field label="Correo">{member.email}</Field>
            <Field label="Teléfono">{member.phone}</Field>
          </dl>
        </section>

        {/* Acceso y rol */}
        <section className="rounded-xl border border-border bg-card p-5 font-heading lg:col-span-1">
          <h2 className="text-sm font-semibold text-primary">Acceso y rol</h2>
          <dl className="mt-4 grid gap-3 border-t border-border pt-4">
            <Field label="Rol">{member.role}</Field>
            <Field label="Estado">
              <StatusChip status={member.status} />
            </Field>
            <Field label="Última conexión">
              <LastSeenChip lastSeen={member.lastSeen} />
            </Field>
            <Field label="Último acceso">{formatDate(member.lastLoginAt)}</Field>
            <Field label="Agregado el">{formatDate(member.addedAt)}</Field>
            <Field label="Agregado por">{member.addedBy}</Field>
          </dl>
        </section>

        {/* Historial operativo */}
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
                    {formatDateTime(event.at)} · {" "}
                    <span className="font-medium">{event.actor}</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}