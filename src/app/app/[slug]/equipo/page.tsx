import { TeamModule } from "@/components/app/team/TeamModule";
import { teamMembers, teamInvitations } from "@/lib/mock/team";

/**
 * Módulo Equipo y permisos (mockup de flujo).
 *
 * Los componentes reciben los datos desde aquí: mientras no exista `GET /team`
 * en el backend, `teamMembers` y `teamInvitations` (mock) hacen de fuente de
 * datos. Al conectar la API solo se cambia este origen.
 */
export default async function TeamPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <TeamModule
      slug={slug}
      members={teamMembers}
      invitations={teamInvitations}
    />
  );
}