import type { TeamMember } from "@/lib/mock/team";
import { FieldInfo } from "./FieldInfo";

/** Tarjeta de datos de contacto del miembro. */
export const MemberContactCard = ({ member }: { member: TeamMember }) => (
  <section className="rounded-xl border border-border bg-card p-5 font-heading lg:col-span-1">
    <h2 className="text-sm font-semibold text-primary">Contacto</h2>
    <dl className="mt-4 grid gap-3 border-t border-border pt-4">
      <FieldInfo label="Nombre">{member.name}</FieldInfo>
      <FieldInfo label="Correo">{member.email}</FieldInfo>
      <FieldInfo label="Teléfono">{member.phone}</FieldInfo>
    </dl>
  </section>
);