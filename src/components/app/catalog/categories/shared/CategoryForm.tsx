"use client";

import { useCallback, useRef, useState, type FormEvent } from "react";
import {
  CloudUpload,
  ImageIcon,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { catalogSubcategories } from "@/lib/mock/catalog";

interface CategoryFormValues {
  name: string;
  description: string;
  slug: string;
  image: File | null;
  subcategories: string[];
}

interface CategoryFormProps {
  /** Identificador para permitir acciones de envío fuera del formulario. */
  id?: string;
  /** Valores iniciales (para editar). */
  initial?: Partial<CategoryFormValues>;
  /** Texto del botón de envío. */
  submitLabel?: string;
  /** Callback al enviar. */
  onSubmit: (values: CategoryFormValues) => void;
  /** Callback al cancelar. */
  onCancel?: () => void;
  /** Muestra las acciones dentro del formulario. */
  showActions?: boolean;
}

/** Genera slug a partir del nombre. */
const toSlug = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

/**
 * Formulario reutilizable para crear/editar una categoría.
 *
 * Campos: Nombre, Descripción, Slug (auto-gen), Foto (drag & drop), Subcategorías (chips).
 */
export const CategoryForm = ({
  id,
  initial,
  submitLabel = "Crear categoría",
  onSubmit,
  onCancel,
  showActions = true,
}: CategoryFormProps) => {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [image, setImage] = useState<File | null>(initial?.image ?? null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [subcats, setSubcats] = useState<string[]>(initial?.subcategories ?? []);
  const [dragOver, setDragOver] = useState(false);
  const [slugManual, setSlugManual] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImage = useCallback((file: File | null) => {
    setImage(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file?.type.startsWith("image/")) handleImage(file);
    },
    [handleImage],
  );

  const toggleSubcat = (id: string) =>
    setSubcats((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description, slug, image, subcategories: subcats });
  };

  return (
    <form id={id} onSubmit={handleSubmit} className="space-y-5">
      
      <div className="grid lg:grid-cols-2 gap-5">
        {/* ── Nombre ─────────────────────────────────────────── */}
        <Field label="Nombre de la categoría" required>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              const nextName = e.target.value;
              setName(nextName);
              if (!slugManual) setSlug(toSlug(nextName));
            }}
            placeholder="Ej: Bebidas, Snacks, Limpieza"
            required
            className={inputCls}
          />
        </Field>

        {/* ── Slug ───────────────────────────────────────────── */}
        <Field
          label="Slug"
          hint="Identificador URL amigable"
        >
          <div className="relative">
            <span className="absolute left-3 top-1/2 h-6 w-6 rounded-md bg-accent flex items-center justify-center -translate-y-1/2 text-sm text-muted-foreground">
              /
            </span>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugManual(true);
              }}
              placeholder="bebidas"
              className={cn(inputCls, "pl-11.5 font-mono text-sm")}
            />
          </div>
        </Field>
      </div>
      
      {/* ── Descripción ────────────────────────────────────── */}
      <Field label="Descripción">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Describe esta categoría (opcional)…"
          className={cn(inputCls, "resize-none h-auto")}
        />
      </Field>

      {/* ── Foto (drag & drop) ─────────────────────────────── */}
      <Field label="Imagen" hint="Opcional. PNG, JPG o WebP.">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-3 transition-all cursor-pointer",
            dragOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/40 hover:bg-muted/30",
            imagePreview && "border-solid border-border p-3 md:max-w-60",
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImage(e.target.files?.[0] ?? null)}
          />

          {imagePreview ? (
            <div className="relative w-full">
              <img
                src={imagePreview}
                alt="Vista previa"
                className="w-full h-50 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleImage(null);
                }}
                className="absolute top-2 right-2 rounded-full bg-background/80 p-1 hover:bg-background cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <div className="h-50 flex flex-col gap-y-5 items-center justify-center">
              <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
                {dragOver ? (
                  <CloudUpload className="size-6 text-primary" />
                ) : (
                  <ImageIcon className="size-6 text-muted-foreground" />
                )}
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">
                  {dragOver ? "Soltar aquí" : "Arrastra una imagen o haz click"}
                </p>
                <p className="text-sm text-muted-foreground">
                  PNG, JPG o WebP · Máx 5MB
                </p>
              </div>
            </div>
          )}
        </div>
      </Field>

      {/* ── Subcategorías ──────────────────────────── */}
      <Field
        label="Subcategorías"
        hint="Opcional. Selecciona las subcategorías que pertenecen a esta categoría."
      >

        {/* Lista de disponibles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {catalogSubcategories.map((sub) => {
            const selected = subcats.includes(sub.id);
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => toggleSubcat(sub.id)}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all cursor-pointer",
                  selected
                    ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
                    : "border-border hover:border-primary/30 hover:bg-muted/30",
                )}
              >
                {/* Checkbox */}
                <div
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-all",
                    selected
                      ? "border-primary bg-primary scale-105"
                      : "border-muted-foreground/30 bg-background",
                  )}
                >
                  {selected && (
                    <svg className="size-3 text-primary-foreground" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2.5 6L5 8.5L9.5 3.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1 flex items-center gap-x-3">
                  <div className="size-10 rounded-lg bg-accent">
                  </div>
                  <div>
                    <p className={cn(
                      "text-sm font-medium truncate",
                      selected ? "text-primary" : "text-foreground",
                    )}>
                      {sub.name}
                    </p>
                    <p className="text-sm text-muted-foreground font-sans truncate">
                      Descripción de la categoría
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </Field>

      {/* ── Footer ─────────────────────────────────────────── */}
      {showActions && onCancel && (
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="px-4"
          >
            Cancelar
          </Button>
          <Button type="submit" className="px-4">
            {submitLabel}
          </Button>
        </div>
      )}
    </form>
  );
};

/** Label + hint + children. */
const Field = ({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-y-3 font-heading">
    <label className="text-sm font-medium">
      {label}
      {required && <span className="text-destructive ml-1">*</span>}
      {hint && <span className="font-normal ml-3 text-sm text-muted-foreground">{hint}</span>}
    </label>
    {children}
  </div>
);

const inputCls =
  "w-full rounded-lg border border-border bg-card px-4 py-2.25 text-sm outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground";
