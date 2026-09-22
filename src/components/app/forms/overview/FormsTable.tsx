import { ClipboardList } from "lucide-react";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import { formChannelLabel, formDestinationLabel, formTypeLabel, type ZentroForm } from "@/lib/mock/forms";
import { FormActionsMenu } from "./FormActionsMenu";

export function FormsTable({ forms, onOpen }: { forms: ZentroForm[]; onOpen: (form: ZentroForm) => void }) {
  return (
    <div className="w-full min-w-0 overflow-x-auto">
      <table className="w-full min-w-max text-left">
        <thead><tr className="bg-accent">{["Formulario", "Canal", "Destino", "Campos", "Respuestas", "Finalización", "Estado"].map((label) => <th key={label} className="px-5 py-3 text-xs font-semibold uppercase text-nowrap">{label}</th>)}<th className="px-5 py-3" /></tr></thead>
        <tbody className="divide-y divide-border">
          {forms.map((form) => (
            <tr key={form.id} onClick={() => onOpen(form)} className="cursor-pointer transition-colors hover:bg-muted/30">
              <td className="px-5 py-3"><div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-lg bg-accent text-primary"><ClipboardList className="size-4" /></span><div><p className="text-sm font-medium">{form.name}</p><p className="text-xs text-muted-foreground">{formTypeLabel(form.type)}</p></div></div></td>
              <td className="px-5 py-3 text-sm">{formChannelLabel(form.channel)}</td>
              <td className="px-5 py-3 text-sm">{formDestinationLabel(form.destination)}</td>
              <td className="px-5 py-3 text-sm tabular-nums">{form.fieldCount}</td>
              <td className="px-5 py-3"><p className="text-sm font-medium tabular-nums">{form.submissions}</p>{form.unreadSubmissions > 0 && <p className="text-xs text-primary">{form.unreadSubmissions} nuevas</p>}</td>
              <td className="px-5 py-3 text-sm tabular-nums">{form.completionRate}%</td>
              <td className="px-5 py-3"><StatusBadge status={form.status} label={form.status === "activo" ? "Publicado" : form.status === "finalizada" ? "Archivado" : undefined} /></td>
              <td className="px-5 py-3"><FormActionsMenu form={form} onOpen={onOpen} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
