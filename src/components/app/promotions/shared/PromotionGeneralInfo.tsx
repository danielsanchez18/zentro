import { Input } from "@/components/ui/input";
import { Field, FormSection } from "./FormSection";
import type { PromotionFormValues } from "./types";

export function PromotionGeneralInfo({
  values,
  errors,
  onChange,
}: {
  values: PromotionFormValues;
  errors: Record<string, string>;
  onChange: (field: keyof PromotionFormValues, value: string) => void;
}) {
  return (
    <FormSection
      title="Información de la promoción"
      description="Define cómo reconocerás esta campaña dentro del sistema."
    >
      <div className="grid gap-5">
        <Field label="Nombre de la promoción" error={errors.name}>
          <Input
            value={values.name}
            onChange={(event) => onChange("name", event.target.value)}
            placeholder="Ej. Bebidas de primavera"
            className="h-fit rounded-lg px-4 py-2"
            aria-invalid={Boolean(errors.name)}
          />
        </Field>
        <Field label="Descripción" error={errors.description}>
          <textarea
            rows={4}
            value={values.description}
            onChange={(event) => onChange("description", event.target.value)}
            placeholder="Describe el beneficio para el cliente."
            className="w-full resize-none rounded-xl border border-input bg-background px-4 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
            aria-invalid={Boolean(errors.description)}
          />
        </Field>
      </div>
    </FormSection>
  );
}
