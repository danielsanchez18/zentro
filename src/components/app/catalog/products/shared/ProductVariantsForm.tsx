import { PackagePlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormSection, productInputClass } from "./FormSection";
import type { ProductVariantDraft } from "./types";

export function ProductVariantsForm({ variants, onChange }: { variants: ProductVariantDraft[]; onChange: (items: ProductVariantDraft[]) => void }) {
  const update = (id: string, field: keyof ProductVariantDraft, value: string) => onChange(variants.map((item) => item.id === id ? { ...item, [field]: value } : item));
  const add = () => onChange([...variants, { id: crypto.randomUUID(), name: "", sku: "", price: "", stock: "" }]);

  return (
    <FormSection title="Variantes" action={<Button type="button"  className="px-3 rounded-full" onClick={add}>Agregar variante</Button>}>
      {variants.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border px-5 py-8 text-center">
          <div className="flex items-center justify-center">
            <span className="flex size-12 items-center justify-center rounded-xl border border-border bg-card"><PackagePlus className="size-5 text-muted-foreground" /></span>
          </div>
          <p className="mt-3 font-heading text-sm font-medium">Este producto no tiene variantes</p>
          <p className="font-heading text-sm text-muted-foreground">Puedes venderlo con un único precio o agregar presentaciones.</p>

        </div>
      ) : (
        <div className="space-y-3">
          {variants.map((variant, index) => (
            <div key={variant.id} className="grid gap-3 md:grid-cols-[1.2fr_1fr_.8fr_.7fr_auto] md:items-end">
              <VariantField label={index === 0 ? "Nombre" : undefined}><input value={variant.name} onChange={(e) => update(variant.id, "name", e.target.value)} placeholder="Ej. Grande" className={productInputClass} /></VariantField>
              <VariantField label={index === 0 ? "SKU" : undefined}><input value={variant.sku} onChange={(e) => update(variant.id, "sku", e.target.value)} placeholder="PROD-GRA" className={productInputClass} /></VariantField>
              <VariantField label={index === 0 ? "Precio" : undefined}><input inputMode="decimal" value={variant.price} onChange={(e) => update(variant.id, "price", e.target.value)} placeholder="0.00" className={productInputClass} /></VariantField>
              <VariantField label={index === 0 ? "Stock" : undefined}><input inputMode="numeric" value={variant.stock} onChange={(e) => update(variant.id, "stock", e.target.value)} placeholder="0" className={productInputClass} /></VariantField>
              <Button type="button" size="icon" variant="ghost" aria-label={`Eliminar variante ${index + 1}`} onClick={() => onChange(variants.filter((item) => item.id !== variant.id))} className="size-10 text-primary hover:text-destructive"><Trash2 className="size-4" /></Button>
            </div>
          ))}
        </div>
      )}
    </FormSection>
  );
}

function VariantField({ label, children }: { label?: string; children: React.ReactNode }) {
  return <label className="grid gap-2 text-xs font-heading uppercase">{label && <span>{label}</span>}{children}</label>;
}
