import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type {
  SupplierFormErrors,
  SupplierFormSetter,
  SupplierFormValues,
} from "./SupplierForm";
import { SupplierField, SupplierFormSection } from "./SupplierFormSection";

const PAYMENT_TERMS_OPTIONS = [
  "Contado",
  "Crédito a 15 días",
  "Crédito a 30 días",
  "Crédito a 45 días",
];

export function SupplierCommercialInfo({
  values,
  errors,
  onChange,
}: {
  values: SupplierFormValues;
  errors: SupplierFormErrors;
  onChange: SupplierFormSetter;
}) {
  return (
    <SupplierFormSection
      title="Condiciones comerciales"
      description="Configuración inicial para estimar compras y reposiciones."
    >
      <div className="flex flex-col gap-y-5">
        <SupplierField label="Condición de pago" required>
          <div className="flex flex-wrap gap-2 pt-1">
            {PAYMENT_TERMS_OPTIONS.map((term) => {
              const isSelected = values.paymentTerms === term;
              return (
                <button
                  key={term}
                  type="button"
                  onClick={() => onChange("paymentTerms", term)}
                  className={cn(
                    "cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-medium transition-all font-heading",
                    isSelected
                      ? "border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary/30"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-accent/30 hover:text-foreground",
                  )}
                >
                  {term}
                </button>
              );
            })}
          </div>
        </SupplierField>
        <SupplierField
          label="Tiempo estimado de entrega"
          required
          error={errors.leadTimeDays}
        >
          <div className="relative flex items-center">
            <Input
              className="h-fit px-4 py-2.25 pr-14 w-full rounded-lg bg-card [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              type="number"
              min={1}
              value={values.leadTimeDays}
              onChange={(e) => onChange("leadTimeDays", Number(e.target.value))}
              aria-invalid={Boolean(errors.leadTimeDays)}
            />
            <span className="pointer-events-none absolute right-4 text-sm text-muted-foreground select-none font-heading">
              días
            </span>
          </div>
        </SupplierField>
      </div>
    </SupplierFormSection>
  );
}
