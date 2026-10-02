import { PresenceOverview } from "@/components/app/presencia/overview/PresenceOverview";

/**
 * Presencia Digital (Roadmap 24 · Fase 7) — `/app/:slug/presencia`.
 *
 * Overview de analítica del sitio web: cómo va, cuánto interacts, de dónde
 * llegan las visitas y qué páginas rinden. Desde acá se entra al constructor.
 */
export default async function PresencePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <PresenceOverview slug={slug} />;
}