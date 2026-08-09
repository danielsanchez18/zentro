import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/** Enlace «Volver a Equipo» para las vistas de detalle del módulo. */
export const MemberBackLink = ({ slug }: { slug: string }) => (
  <Link
    href={`/app/${slug}/equipo`}
    className="inline-flex items-center gap-1.5 text-sm font-heading hover:underline underline-offset-4"
  >
    <ArrowLeft className="size-3.5" /> Volver a Equipo
  </Link>
);