"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Loader2, ArrowRight } from "lucide-react";
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
 * Paso 1 de la creación de organización: modal con nombre + slug (auto-sugerido).
 * Al confirmar navega a `/dashboard/onboarding` (paso 2: rubro, sucursal, módulos).
 * TODO(0.2): POST /orgs { name, slug } antes de navegar.
 */
const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const NewOrganizationDialog = ({
  open,
  onOpenChange,
}: NewOrganizationDialogProps) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const handleCreate = () => {
    setSaving(true);
    // TODO(0.2): llamar POST /orgs { name, slug } → obtiene orgId
    setTimeout(() => {
      setSaving(false);
      setName("");
      setSlug("");
      setSlugTouched(false);
      onOpenChange(false);
      router.push("/dashboard/onboarding");
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-sans text-base">
            <Building2 className="size-4 text-primary" /> Crea tu organización
          </DialogTitle>
          <DialogDescription className="text-sm">
            Sólo nombre y slug para arrancar. El resto (rubro, tu local y módulos)
            lo configuramos a continuación.
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
              onChange={(e) => handleNameChange(e.target.value)}
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
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugTouched(true);
                }}
                placeholder="zentro"
                className="text-sm px-3 py-2 h-fit"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {slug ? `Tu workspace será /app/${slug}` : "Se autogenera desde el nombre."}
            </p>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
            className="text-sm px-3 rounded-full"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleCreate}
            disabled={saving || !name.trim() || !slug.trim()}
            className="text-sm px-3 rounded-full"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
            {saving ? "Creando…" : "Crear y configurar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};