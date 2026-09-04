import { Input } from "@/components/ui/input";
import type {
  SupplierFormErrors,
  SupplierFormSetter,
  SupplierFormValues,
} from "./SupplierForm";
import { SupplierField, SupplierFormSection } from "./SupplierFormSection";

export function SupplierContactInfo({
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
      title="Contacto principal"
      description="Persona y canales que se utilizarán para coordinar compras y entregas."
    >
      <div className="grid gap-5 md:grid-cols-2">
        <SupplierField
          label="Nombre del contacto"
          required
          error={errors.contactName}
        >
          <Input
            className="px-4 py-2.25 h-fit rounded-lg bg-card"
            value={values.contactName}
            onChange={(e) => onChange("contactName", e.target.value)}
            placeholder="Nombre y apellidos"
            aria-invalid={Boolean(errors.contactName)}
          />
        </SupplierField>
        <SupplierField label="Correo electrónico" required error={errors.email}>
          <Input
            className="px-4 py-2.25 h-fit rounded-lg bg-card"
            type="email"
            value={values.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="ventas@proveedor.pe"
            aria-invalid={Boolean(errors.email)}
          />
        </SupplierField>
        <SupplierField label="Teléfono">
          <Input
            className="px-4 py-2.25 h-fit rounded-lg bg-card"
            type="tel"
            value={values.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="+51 999 999 999"
          />
        </SupplierField>
        <SupplierField label="Dirección">
          <Input
            className="px-4 py-2.25 h-fit rounded-lg bg-card"
            value={values.address}
            onChange={(e) => onChange("address", e.target.value)}
            placeholder="Dirección fiscal o de despacho"
          />
        </SupplierField>
      </div>
    </SupplierFormSection>
  );
}
