import { Field, FormSection, productInputClass } from "./FormSection";

interface ProductBasicInfoProps {
  name: string;
  sku: string;
  weight: string;
  description: string;
  onChange: (
    field: "name" | "sku" | "weight" | "description",
    value: string,
  ) => void;
}

export function ProductBasicInfo(props: ProductBasicInfoProps) {
  return (
    <FormSection title="Información del producto">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Nombre del producto">
          <input
            required
            value={props.name}
            onChange={(e) => props.onChange("name", e.target.value)}
            placeholder="Ej. Hamburguesa Royale"
            className={productInputClass}
          />
        </Field>

        <Field label="SKU">
          <input
            required
            value={props.sku}
            onChange={(e) => props.onChange("sku", e.target.value)}
            placeholder="Ej. PROD-001"
            className={productInputClass}
          />
        </Field>

        <div className="md:col-span-2">
          <Field label="Descripción">
            <textarea
              value={props.description}
              onChange={(e) => props.onChange("description", e.target.value)}
              placeholder="Describe sus ingredientes, presentación o características."
              rows={5}
              className="w-full resize-none rounded-xl border border-input bg-background px-4 py-2.25 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </Field>
        </div>
      </div>
    </FormSection>
  );
}
