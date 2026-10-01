import { MemberDetailPage } from "@/components/app/team/member-detail/MemberDetailPage";

/**
 * Detalle de un integrante del equipo.
 *
 * Los datos (miembros, roles, invitaciones) viven en `useTeamStore`; la página
 * resuelve slug/memberId y delega el render al componente cliente.
 */
export default async function MemberDetailPageRoute({
  params,
}: {
  params: Promise<{ slug: string; memberId: string }>;
}) {
  const { slug, memberId } = await params;

  return <MemberDetailPage slug={slug} memberId={memberId} />;
}