import { AuditModule } from "@/components/app/audit/AuditModule";

/**
 * Auditoría del workspace (Roadmap 26 · Fase 8).
 *
 * Registro de actividad append-only y de solo lectura: quién hizo qué, cuándo
 * y en qué módulo. El permiso `auditoria` es `admin` para Owner/Administrador
 * y `none` para el resto de roles. En el prototipo se alimenta de
 * `audit-store` (semilla mock); al conectar la API solo cambia el origen.
 */
export default async function AuditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <AuditModule slug={slug} />;
}