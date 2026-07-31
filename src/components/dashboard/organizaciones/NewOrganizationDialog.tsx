"use client";

import { useState } from "react";
import { Building2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NewOrganizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal de creación de organización.
 * TODO(0.2): POST /orgs + auto-sugerir slug desde el nombre.
 */
export const NewOrganizationDialog = ({
  open,
  onOpenChange,
}: NewOrganizationDialogProps) => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [saving, setSaving] = useState(false);

  const handleCreate = () => {
    setSaving(true);
    // TODO(0.2): llamar POST /orgs { name, slug }
    setTimeout(() => {
      setSaving(false);
      setName("");
      setSlug("");
      onOpenChange(false);
    }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-sans text-base">
            <Building2 className="size-4 text-primary" /> Nueva organización
          </DialogTitle>
          <DialogDescription>
            Crea tu espacio de trabajo. Podrás configurar tu workspace e invitar a tu equipo después.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-col gap-y-2">
            <label htmlFor="org-name" className="text-sm font-medium">
              Nombre
            </label>
            <Input
              id="org-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Zentro"
              autoFocus
              className="text-sm px-3 py-2 h-fit"
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <label htmlFor="org-slug" className="text-sm font-medium">
              Slug (link del workspace)
            </label>
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-muted-foreground">/app/</span>
              <Input
                id="org-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="zentro"
                className="text-sm px-3 py-2 h-fit"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
            className="text-sm px-3 py-2 h-fit rounded-full"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleCreate}
            disabled={saving || !name.trim()}
            className="text-sm px-3 py-2 h-fit rounded-full"
          >
            {saving && <Loader2 className="size-4 animate-spin" />}
            {saving ? "Creando…" : "Crear organización"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
