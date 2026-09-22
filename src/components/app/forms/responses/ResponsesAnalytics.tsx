import { CheckCircle2, Clock3, RefreshCcw, XCircle } from "lucide-react";
import type { FormResponse, FormResponseStatus } from "@/lib/mock/forms";

export function ResponsesAnalytics({ responses }: { responses: FormResponse[] }) {
  const total = responses.length;
  const count = (status: FormResponseStatus) =>
    responses.filter((item) => item.status === status).length;

  const pct = (val: number) =>
    total ? `${Math.round((val / total) * 100)}% del total` : "0% del total";

  const stats = [
    {
      title: "Nuevas",
      value: count("nueva"),
      suffix: "respuestas",
      subtitle: pct(count("nueva")),
      icon: Clock3,
    },
    {
      title: "Revisadas",
      value: count("revisada"),
      suffix: "respuestas",
      subtitle: pct(count("revisada")),
      icon: CheckCircle2,
    },
    {
      title: "Convertidas",
      value: count("convertida"),
      suffix: "respuestas",
      subtitle: pct(count("convertida")),
      icon: RefreshCcw,
    },
    {
      title: "Descartadas",
      value: count("descartada"),
      suffix: "respuestas",
      subtitle: pct(count("descartada")),
      icon: XCircle,
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <article
          key={item.title}
          className="rounded-xl border border-border bg-card px-5 py-4 font-heading"
        >
          <div className="flex items-center justify-between text-primary/70">
            <p className="text-sm">{item.title}</p>
            <item.icon className="size-4.5" />
          </div>
          <p className="mt-2 text-xl font-medium tabular-nums">
            {item.value.toLocaleString("es-PE")}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              {item.suffix}
            </span>
          </p>
          <p className="mt-1 text-xs text-primary/70">{item.subtitle}</p>
        </article>
      ))}
    </section>
  );
}

