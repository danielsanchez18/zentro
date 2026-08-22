import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

/** Enlace «Volver a Equipo» para las vistas de detalle del módulo. */
export const MemberBackLink = ({ slug }: { slug: string }) => (
  <div className="flex items-center gap-x-5 justify-between">
    <Link
      href={`/app/${slug}/equipo`}
      className="inline-flex items-center gap-1 text-sm font-heading hover:underline underline-offset-4"
    >
      <ChevronLeft className="size-4" />
      Regresar
    </Link>

    <Link
      href={`/app/${slug}/equipo`}
      className="inline-flex items-center gap-1 text-sm font-heading hover:underline underline-offset-4"
    >
      Siguiente
      <ChevronRight className="size-4" />
    </Link>
  </div>
);