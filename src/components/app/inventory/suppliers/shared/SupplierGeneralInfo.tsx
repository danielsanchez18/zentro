import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type {
  SupplierFormErrors,
  SupplierFormSetter,
  SupplierFormValues,
} from "./SupplierForm";
import { SupplierField, SupplierFormSection } from "./SupplierFormSection";

export function SupplierGeneralInfo({
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
      title="Información general"
      description="Datos fiscales y comerciales con los que identificarás al proveedor."
    >
      <div className="grid gap-5 md:grid-cols-2">
        <SupplierField
          label="Razón social"
          required
          error={errors.businessName}
        >
          <Input
            className="h-fit py-2.25 px-4 rounded-lg bg-card"
            value={values.businessName}
            onChange={(e) => onChange("businessName", e.target.value)}
            placeholder="Ej. Distribuidora Andina S.A.C."
            aria-invalid={Boolean(errors.businessName)}
          />
        </SupplierField>
        <SupplierField
          label="Nombre comercial"
          required
          error={errors.tradeName}
        >
          <Input
            className="h-fit py-2.25 px-4 rounded-lg bg-card"
            value={values.tradeName}
            onChange={(e) => onChange("tradeName", e.target.value)}
            placeholder="Ej. Andina Foods"
            aria-invalid={Boolean(errors.tradeName)}
          />
        </SupplierField>
        <div className="md:col-span-2">
          <SupplierField
            label="RUC"
            required
            hint="11 dígitos"
            error={errors.documentNumber}
          >
            <Input
              className="h-fit py-2.25 px-4 rounded-lg bg-card"
              inputMode="numeric"
              maxLength={11}
              value={values.documentNumber}
              onChange={(e) =>
                onChange("documentNumber", e.target.value.replace(/\D/g, ""))
              }
              placeholder="20123456789"
              aria-invalid={Boolean(errors.documentNumber)}
            />
          </SupplierField>
        </div>
        <div className="md:col-span-2">
          <SupplierField label="Estado">
            <label className="flex h-fit cursor-pointer items-center justify-between rounded-lg border border-border bg-card px-4 py-2.25 transition-colors hover:bg-accent/20">
              <span className="text-sm font-normal text-muted-foreground">
                {values.status === "activo" ? "Activo" : "Inactivo"}
              </span>
              <Switch
                checked={values.status === "activo"}
                onCheckedChange={(checked) =>
                  onChange("status", checked ? "activo" : "inactivo")
                }
              />
            </label>
          </SupplierField>
        </div>
      </div>
    </SupplierFormSection>
  );
}
