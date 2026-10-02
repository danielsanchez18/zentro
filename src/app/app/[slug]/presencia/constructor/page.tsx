import { WebPresenceModule } from "@/components/app/presencia/WebPresenceModule";

/**
 * Constructor Web (Roadmap 24 · Fase 7) — `/app/:slug/presencia/constructor`.
 *
 * El constructor por bloques. El overview con analítica vive en `/presencia`.
 */
export default async function PresenceConstructorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <WebPresenceModule slug={slug} />;
}