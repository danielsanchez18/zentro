"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Loader2,
  ArrowRight,
  Check,
  X,
  ShieldCheck,
  Sparkles,
  UserX,
} from "lucide-react";
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
import {
  createOrgService,
  checkAvailabilityService,
} from "@/lib/services/orgs.service";
import { useTenantStore } from "@/stores/tenant-store";

interface NewOrganizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Se llama tras crear la org (para refrescar la lista). */
  onCreated?: () => void;
}

/** Convierte un nombre a slug (lowercase, sin acentos, solo a-z0-9-). */
export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

type VerifyState =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "ok" }
  | { status: "taken"; nameTaken: boolean; suggestions: string[] }
  | { status: "error" };

/**
 * Paso 1 de la creación de organización: nombre + slug (auto-sugerido desde el
 * nombre, sin peticiones). Un botón "Verificar" consulta de forma explícita la
 * disponibilidad: nombre único por usuario + slug único global, y sugiere
 * alternativas si el slug está ocupado.
 */
export const NewOrganizationDialog = ({
  open,
  onOpenChange,
  onCreated,
}: NewOrganizationDialogProps) => {
  const router = useRouter();
  const { setActiveTenant } = useTenantStore();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [verify, setVerify] = useState<VerifyState>({ status: "idle" });
  const [createError, setCreateError] = useState<string | null>(null);

  const handleNameChange = (value: string) => {
    setName(value);
    setVerify({ status: "idle" });
    setCreateError(null);
    if (!slugTouched) setSlug(slugify(value));
  };

  const handleSlugChange = (value: string) => {
    setSlug(value);
    setSlugTouched(true);
    setVerify({ status: "idle" });
    setCreateError(null);
  };

  const handleVerify = async () => {
    if (!name.trim() || !slug.trim()) return;
    setVerify({ status: "checking" });
    setCreateError(null);
    try {
      const res = await checkAvailabilityService(name.trim(), slug.trim());
      if (!res.nameTaken && res.slugAvailable) {
        setVerify({ status: "ok" });
      } else {
        setVerify({
          status: "taken",
          nameTaken: res.nameTaken,
          suggestions: res.suggestions,
        });
      }
    } catch {
      setVerify({ status: "error" });
    }
  };

  const applySuggestion = (value: string) => {
    setSlug(value);
    setSlugTouched(true);
    setVerify({ status: "idle" });
  };

  const handleCreate = async () => {
    if (!name.trim() || !slug.trim()) return;
    setSaving(true);
    setCreateError(null);
    try {
      const org = await createOrgService({ name: name.trim(), slug: slug.trim() });
      setActiveTenant({
        orgId: org.id,
        slug: org.slug,
        name: org.name,
        plan: org.plan,
        planSlug: org.planSlug,
        subscriptionStatus: org.subscriptionStatus,
        trialEndsAt: org.trialEndsAt,
      });
      setName("");
      setSlug("");
      setSlugTouched(false);
      setVerify({ status: "idle" });
      onOpenChange(false);
      onCreated?.();
      router.push(`/dashboard/onboarding?org=${org.id}`);
    } catch (err) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "No pudimos crear la organización.";
      setCreateError(message);
    } finally {
      setSaving(false);
    }
  };

  const slugInvalid = !!slug && !/^[a-z0-9-]+$/.test(slug);
  const nameTaken = verify.status === "taken" && verify.nameTaken;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-sans text-base">
            <Building2 className="size-4 text-primary" /> Crea tu organización
          </DialogTitle>
          <DialogDescription className="text-sm">
            El nombre es único para tu cuenta. El slug es el link de tu workspace.
            Verifica disponibilidad antes de continuar.
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
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="zentro"
                className="text-sm px-3 py-2 h-fit"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {slug ? `Tu workspace será /app/${slug}` : "Se autogenera desde el nombre."}
            </p>
          </div>

          {/* Resultado de la verificación */}
          {verify.status !== "idle" && (
            <div className="rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-sm space-y-1.5">
              {verify.status === "checking" && (
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Loader2 className="size-3.5 animate-spin" /> Verificando disponibilidad…
                </span>
              )}

              {verify.status === "error" && (
                <span className="flex items-center gap-1.5 text-destructive">
                  <X className="size-3.5" /> No pudimos verificar. Intenta de nuevo.
                </span>
              )}

              {verify.status === "ok" && (
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <Check className="size-3.5" /> Nombre y slug disponibles.
                </span>
              )}

              {nameTaken && (
                <span className="flex gap-1.5 text-destructive">
                  <UserX className="size-3.5 mt-0.5" />
                  Ya tienes una organización llamada {`"${name}"`}. Usa otro nombre.
                </span>
              )}

              {verify.status === "taken" && !nameTaken && (
                <span className="flex items-center gap-1.5 text-destructive">
                  <X className="size-3.5" /> Ese slug ya está en uso
                </span>
              )}

              {verify.status === "taken" &&
                !nameTaken &&
                verify.suggestions.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Sparkles className="size-3" /> Sugerencias
                    </span>
                    {verify.suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => applySuggestion(s)}
                        className="rounded-full border border-border bg-background px-2 py-0.5 text-xs font-medium text-foreground hover:bg-muted/60 transition-colors"
                      >
                        /app/{s}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          )}

          {slug && slugInvalid && (
            <p className="text-sm text-destructive">
              Sólo minúsculas, números y guiones
            </p>
          )}

          {createError && <p className="text-sm text-destructive">{createError}</p>}
        </div>

        <DialogFooter className="sm:justify-between">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving || verify.status === "checking"}
            className="text-sm px-3 rounded-full"
          >
            Cancelar
          </Button>

          {/* Acción principal: primero "Verificar", tras verificar OK pasa a "Crear". */}
          {verify.status === "ok" ? (
            <Button
              type="button"
              onClick={handleCreate}
              disabled={saving}
              className="text-sm px-3 rounded-full"
            >
              {saving ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
              {saving ? "Creando…" : "Crear y configurar"}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleVerify}
              disabled={
                verify.status === "checking" ||
                saving ||
                !name.trim() ||
                !slug.trim() ||
                slugInvalid
              }
              className="text-sm px-3 rounded-full"
            >
              {verify.status === "checking" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ShieldCheck className="size-4" />
              )}
              {verify.status === "checking" ? "Verificando…" : "Verificar"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};