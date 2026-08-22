import type { TeamMember } from "@/lib/mock/team";

const formatDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("es-CL", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Nunca";

/** Tarjeta de acceso y rol del miembro. */
export const MemberAccessCard = ({ member }: { member: TeamMember }) => (
  <section className="rounded-xl border border-border bg-card p-5 font-heading lg:col-span-1">
    <h2 className="text-sm font-semibold text-primary">Acceso y rol</h2>
    <dl className="mt-4 grid gap-3 border-t border-border pt-4">
      
    </dl>
  </section>
);