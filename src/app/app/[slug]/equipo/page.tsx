import { KPIS } from "@/components/app/team/KPIS";
import { List } from "@/components/app/team/List";
import { Title } from "@/components/app/team/Title";
import { teamMembers } from "@/lib/mock/team";

/**
 * Módulo Equipo y permisos (mockup de flujo).
 *
 * Los componentes reciben los datos desde aquí: mientras no exista `GET /team`
 * en el backend, `teamMembers` (mock) hace de fuente de datos. Al conectar la
 * API solo se cambia este origen.
 */
export default async function TeamPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="w-full px-5 md:px-7 xl:px-10 py-7 space-y-10 lg:space-y-7">
      <Title />
      <KPIS members={teamMembers} />
      <List initialMembers={teamMembers} slug={slug} />
    </div>
  );
}
