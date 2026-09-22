"use client";

import { useState } from "react";
import { Copy, Eye, Inbox, MoreHorizontal, Pause, Pencil, Play, Send, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/app/team/ConfirmDialog";
import { toastMsg } from "@/components/ui/toast-message";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ZentroForm } from "@/lib/mock/forms";
import { useFormsStore } from "@/stores/forms-store";

export function FormActionsMenu({ form, onOpen }: { form: ZentroForm; onOpen: (form: ZentroForm) => void }) {
  const setStatus = useFormsStore((state) => state.setStatus);
  const duplicateForm = useFormsStore((state) => state.duplicateForm);
  const removeForm = useFormsStore((state) => state.removeForm);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const toggle = () => {
    const next = form.status === "activo" ? "pausada" : "activo";
    setStatus(form.id, next);
    toastMsg.success(next === "activo" ? "Formulario publicado" : "Formulario pausado", form.name);
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger onClick={(event) => event.stopPropagation()} className="cursor-pointer rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label={`Acciones de ${form.name}`}>
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52" onClick={(event) => event.stopPropagation()}>
          <DropdownMenuItem onClick={() => onOpen(form)}><Eye />Vista previa</DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/app/${params.slug}/formularios/${form.id}/editar`)}><Pencil />Editar formulario</DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/app/${params.slug}/formularios/${form.id}/respuestas`)}><Inbox />Ver respuestas</DropdownMenuItem>
          <DropdownMenuItem onClick={() => { duplicateForm(form.id); toastMsg.info("Formulario duplicado", "La copia quedó guardada como borrador."); }}><Copy />Duplicar</DropdownMenuItem>
          {!["finalizada"].includes(form.status) && (
            <DropdownMenuItem onClick={toggle}>
              {form.status === "activo" ? <Pause /> : form.status === "borrador" ? <Send /> : <Play />}
              {form.status === "activo" ? "Pausar" : "Publicar"}
            </DropdownMenuItem>
          )}
          {form.status === "borrador" && (
            <><DropdownMenuSeparator /><DropdownMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}><Trash2 />Eliminar borrador</DropdownMenuItem></>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} title="Eliminar borrador" description={`¿Deseas eliminar “${form.name}”? Esta acción no afecta respuestas porque el formulario aún no fue publicado.`} confirmLabel="Eliminar" onConfirm={() => { removeForm(form.id); toastMsg.info("Formulario eliminado", form.name); }} />
    </>
  );
}
