import { ClipboardList, Route, Rows3 } from "lucide-react";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import { formChannelLabel, formDestinationLabel, formTypeLabel, type ZentroForm } from "@/lib/mock/forms";
import { FormActionsMenu } from "./FormActionsMenu";

export function FormCard({ form, onOpen }: { form: ZentroForm; onOpen: (form: ZentroForm) => void }) {
  return (
    <article onClick={() => onOpen(form)} className="group cursor-pointer rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary"><ClipboardList className="size-4.5" /></span>
          <div className="min-w-0"><h3 className="truncate text-sm font-medium group-hover:text-primary">{form.name}</h3><p className="mt-0.5 text-xs text-muted-foreground">{formTypeLabel(form.type)} · {formChannelLabel(form.channel)}</p></div>
        </div>
        <FormActionsMenu form={form} onOpen={onOpen} />
      </div>
      <p className="mt-4 line-clamp-2 min-h-10 text-sm text-muted-foreground">{form.description}</p>
      <div className="mt-4 grid grid-cols-2 gap-3 border-y border-border py-3 text-sm">
        <div><p className="text-xs text-muted-foreground">Respuestas</p><p className="mt-1 font-medium">{form.submissions} {form.unreadSubmissions > 0 && <span className="text-primary">· {form.unreadSubmissions} nuevas</span>}</p></div>
        <div><p className="text-xs text-muted-foreground">Finalización</p><p className="mt-1 font-medium">{form.completionRate}%</p></div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3 text-xs text-muted-foreground"><span className="flex items-center gap-1"><Rows3 className="size-3.5" />{form.fieldCount} campos</span><span className="flex min-w-0 items-center gap-1 truncate"><Route className="size-3.5 shrink-0" />{formDestinationLabel(form.destination)}</span></div>
        <StatusBadge status={form.status} label={form.status === "activo" ? "Publicado" : form.status === "finalizada" ? "Archivado" : undefined} />
      </div>
    </article>
  );
}
