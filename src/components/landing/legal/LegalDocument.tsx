import Link from "next/link";
import type { LegalDoc } from "./types";

type LegalDocumentProps = {
  doc: LegalDoc;
  related: { label: string; href: string };
};

export function LegalDocument({ doc, related }: LegalDocumentProps) {
  return (
    <section className="py-10 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10 lg:gap-16 items-start max-w-5xl mx-auto">
      {/* Índice */}
      <aside className="min-w-0 lg:sticky lg:top-8">
        <p className="text-sm text-muted-foreground mb-3">En esta página</p>
        <nav aria-label="Índice del documento">
          <ol className="space-y-1 border-s border-border">
            {doc.sections.map((section, index) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="-ms-px block border-s border-transparent ps-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                >
                  {index + 1}. {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </aside>

      {/* Contenido */}
      <article className="min-w-0 space-y-12">
        <p className="text-lg leading-relaxed text-gray-900 dark:text-neutral-200">
          {doc.intro}
        </p>

        {doc.sections.map((section, index) => (
          <div
            key={section.id}
            id={section.id}
            className="scroll-mt-8 space-y-4 border-t border-border pt-10"
          >
            <h2 className="flex items-baseline gap-x-3 text-xl md:text-2xl font-semibold tracking-tight">
              <span className="font-oswald text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              {section.title}
            </h2>
            {section.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-muted-foreground leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>
        ))}

        {/* Cierre */}
        <div className="glass rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-5 sm:justify-between">
          <div className="space-y-1">
            <h2 className="font-semibold">¿Tienes preguntas sobre este documento?</h2>
            <p className="text-sm text-muted-foreground">
              Escríbenos y te respondemos. También puedes revisar nuestra{" "}
              <Link
                href={related.href}
                className="text-primary hover:underline"
              >
                {related.label}
              </Link>
              .
            </p>
          </div>
          <Link
            href="/contacto"
            className="landing-btn-glow shrink-0 inline-flex items-center justify-center bg-primary text-primary-foreground rounded-full px-4 py-1.5 text-base font-medium"
          >
            Contactar
          </Link>
        </div>
      </article>
    </section>
  );
}
