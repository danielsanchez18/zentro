import { ClipboardCheck, Eye, Inbox, TrendingUp } from "lucide-react";
import type { ZentroForm } from "@/lib/mock/forms";

export function FormsKpis({ forms }: { forms: ZentroForm[] }) {
  const active = forms.filter((form) => form.status === "activo");
  const submissions = forms.reduce((sum, form) => sum + form.submissions, 0);
  const unread = forms.reduce((sum, form) => sum + form.unreadSubmissions, 0);
  const average = active.length
    ? Math.round(active.reduce((sum, form) => sum + form.completionRate, 0) / active.length)
    : 0;
  const stats = [
    { title: "Publicados", value: active.length, suffix: "formularios", subtitle: "Recibiendo respuestas", icon: Eye },
    { title: "Respuestas", value: submissions, suffix: "registros", subtitle: "Acumuladas en el prototipo", icon: ClipboardCheck },
    { title: "Por revisar", value: unread, suffix: "respuestas", subtitle: "Nuevas o sin procesar", icon: Inbox },
    { title: "Finalización", value: average, suffix: "%", subtitle: "Promedio de publicados", icon: TrendingUp },
  ];
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <article key={item.title} className="rounded-xl border border-border bg-card px-5 py-4 font-heading">
          <div className="flex items-center justify-between text-primary/70"><p className="text-sm">{item.title}</p><item.icon className="size-4.5" /></div>
          <p className="mt-2 text-xl font-medium">{item.value.toLocaleString("es-PE")} <span className="text-sm">{item.suffix}</span></p>
          <p className="mt-1 text-xs text-primary/70">{item.subtitle}</p>
        </article>
      ))}
    </section>
  );
}
