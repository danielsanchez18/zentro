import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FormSection } from "./FormSection";
import type { PromotionFormValues } from "./types";

const TYPES = [{ value: "porcentaje", label: "Descuento porcentual" }, { value: "monto_fijo", label: "Monto fijo" }, { value: "precio_fijo", label: "Precio promocional" }] as const;

export function PromotionBenefit({ values, errors, onChange }: { values: PromotionFormValues; errors: Record<string, string>; onChange: (field: keyof PromotionFormValues, value: string) => void }) {
  return <FormSection title="Beneficio" description="Configura el descuento que verá el cliente."><div className="grid gap-5 md:grid-cols-2"><Field label="Tipo de beneficio"><Select value={values.type} onValueChange={(value) => onChange("type", value as string)} items={TYPES}><SelectTrigger className="h-fit w-full rounded-lg px-4 py-2"><SelectValue /></SelectTrigger><SelectContent>{TYPES.map((type) => <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>)}</SelectContent></Select></Field><Field label="Valor" hint={values.type === "porcentaje" ? "Porcentaje entre 1 y 100." : "Importe expresado en soles."} error={errors.value}><div className="relative"><Input inputMode="decimal" value={values.value} onChange={(event) => onChange("value", event.target.value)} placeholder="0.00" className="h-fit rounded-lg px-4 py-2 pr-12" aria-invalid={Boolean(errors.value)} /><span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{values.type === "porcentaje" ? "%" : "S/"}</span></div></Field></div></FormSection>;
}
