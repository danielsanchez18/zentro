import Link from "next/link";
import { ChevronLeft } from "lucide-react";

/** Enlace «Volver a Equipo» para las vistas de detalle del módulo. */
export const MemberBackLink = ({ slug }: { slug: string }) => (
  <Link
    href={`/app/${slug}/equipo`}
    className="h-fit p-0 inline-flex items-center font-medium gap-1 text-sm hover:underline underline-offset-4"
  >
    Regresar a equipo y permisos
  </Link>
);
