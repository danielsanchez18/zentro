import Link from "next/link";

/**
 * Footer del Hub. FAQ lleva a la Ayuda del propio Hub; los documentos legales
 * son públicos (landing) y se abren en otra pestaña para no salir del panel.
 */
const LINKS = [
  { href: "/dashboard/ayuda", label: "Preguntas frecuentes", external: false },
  { href: "/terminos-y-condiciones", label: "Términos y condiciones", external: true },
  { href: "/politica-de-privacidad", label: "Política de privacidad", external: true },
];

export const Footer = () => {
  return (
    <div className="hidden lg:block w-full px-2 max-w-350 mx-auto pt-2 pb-2">
      <footer className="w-full rounded-sm bg-card px-4 py-3 text-muted-foreground text-sm flex items-center justify-center sm:justify-between gap-x-5 gap-y-3 flex-wrap">
        <p>{new Date().getFullYear()} © Zentro</p>
        <nav aria-label="Enlaces del pie de página" className="flex items-center gap-x-3">
          {LINKS.map((link, index) => (
            <span key={link.href} className="flex items-center gap-x-3">
              {index > 0 && <span aria-hidden="true" className="h-5 w-px bg-muted-foreground rotate-20" />}
              <Link
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="text-sm transition-colors hover:text-foreground hover:underline"
              >
                {link.label}
              </Link>
            </span>
          ))}
        </nav>
      </footer>
    </div>
  );
};
