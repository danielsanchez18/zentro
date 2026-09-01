"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormSection } from "./FormSection";

export function ProductMedia({ images, onChange }: { images: File[]; onChange: (images: File[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previews = useMemo(() => images.map((file) => URL.createObjectURL(file)), [images]);

  useEffect(() => () => previews.forEach(URL.revokeObjectURL), [previews]);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    onChange([...images, ...Array.from(files).filter((file) => file.type.startsWith("image/")).slice(0, 10 - images.length)]);
  };

  return (
    <FormSection title="Multimedia" description="Agrega hasta 10 imágenes. La primera será la portada del producto.">
      <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
      {images.length > 0 && (
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {previews.map((src, index) => (
            <div key={src} className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted">
              <Image src={src} alt={`Imagen ${index + 1} del producto`} fill unoptimized className="object-cover" />
              {index === 0 && <span className="absolute left-2 top-2 rounded-md bg-background/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide">Portada</span>}
              <Button type="button" size="icon" variant="secondary" aria-label={`Eliminar imagen ${index + 1}`} onClick={() => onChange(images.filter((_, itemIndex) => itemIndex !== index))} className="absolute right-2 top-2 size-8 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      <button type="button" onClick={() => inputRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }} className="flex min-h-40 w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border bg-muted/25 p-10 text-center transition-colors hover:border-primary/50 hover:bg-primary/5">
        <span className="flex size-12 items-center justify-center rounded-xl border border-border bg-card"><ImagePlus className="size-5 text-muted-foreground" /></span>
        <span className="mt-3 font-heading text-sm font-medium">Arrastra imágenes o selecciónalas</span>
        <span className="font-heading text-sm text-muted-foreground">PNG, JPG o WebP · máximo 5 MB por archivo</span>
      </button>
    </FormSection>
  );
}
