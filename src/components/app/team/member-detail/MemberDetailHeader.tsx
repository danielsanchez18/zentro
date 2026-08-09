import type { TeamMember } from "@/lib/mock/team";
import { StatusBadge } from "../../shared/StatusBadge";
import { LastSeenChip } from "../Table";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

/** Cabecera del detalle: avatar, nombre, rol/estado y fecha de ingreso. */
export const MemberDetailHeader = ({ member }: { member: TeamMember }) => (
  <section className="mt-5 flex flex-col gap-5 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-center gap-4">
      <div className="bg-accent flex h-16 w-16 items-center justify-center overflow-hidden rounded-full">
        <span className="text-xl font-semibold text-muted-foreground">
          {initials(member.name)}
        </span>
      </div>
      <div>
        <h1 className="font-heading text-xl font-semibold">{member.name}</h1>
        <p className="text-sm text-muted-foreground">{member.email}</p>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
            {member.role}
          </span>
          <StatusBadge status={member.status} />
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
);