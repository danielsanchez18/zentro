import { teamMembers } from "@/lib/mock/team";
import { MemberBackLink } from "@/components/app/team/member-detail/MemberBackLink";
import { MemberDetailHeader } from "@/components/app/team/member-detail/MemberDetailHeader";
import { MemberContactCard } from "@/components/app/team/member-detail/MemberContactCard";
import { MemberAuditCard } from "@/components/app/team/member-detail/MemberAuditCard";
import { MemberNotFound } from "@/components/app/team/member-detail/MemberNotFound";

/**
 * Detalle de un integrante del equipo.
 *
 * La página solo resuelve el miembro y compone las secciones; cada bloque de
 * UI vive en `components/app/team/member-detail/`.
 */
export default async function MemberDetailPage({
  params,
}: {
  params: Promise<{ slug: string; memberId: string }>;
}) {
  const { slug, memberId } = await params;
  const member = teamMembers.find((m) => m.id === memberId);

  if (!member) {
    return <MemberNotFound slug={slug} />;
  }

  return (
    <div className="w-full px-5 md:px-7 xl:px-10 py-7">
      <MemberBackLink slug={slug} />

      <MemberDetailHeader member={member} />

      <div className="mt-5 grid gap-5 lg:grid-cols-[auto_1fr] lg:p-5 lg:border border-border lg:rounded-xl lg:bg-card">
        <MemberContactCard member={member} />
        <MemberAuditCard member={member} />
      </div>
    </div>
  );
}