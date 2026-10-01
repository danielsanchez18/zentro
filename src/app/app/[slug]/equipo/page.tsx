import { TeamModule } from "@/components/app/team/TeamModule";

/**
 * Módulo Equipo y permisos (prototipo frontend).
 *
 * Los datos (miembros, invitaciones y roles) viven en `useTeamStore`
 * (`src/stores/team-store.ts`) con orígenes mock de `src/lib/mock/team.ts`.
 * Al conectar la API solo se cambia el origen del store.
 */
export default async function TeamPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <TeamModule slug={slug} />;
}