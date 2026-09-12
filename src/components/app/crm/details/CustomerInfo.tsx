import {
  Building2,
  Mail,
  MapPin,
  Phone,
  CreditCard,
  Store,
  Tag,
  Calendar,
  FileText,
  User,
  IdCard,
} from "lucide-react";
import {
  crmChannelLabel,
  customerPrimaryAddress,
  type CrmCustomer,
} from "@/lib/mock/crm";

export function CustomerInfo({ customer }: { customer: CrmCustomer }) {
  const address = customerPrimaryAddress(customer);
  const KindIcon = customer.kind === "empresa" ? Building2 : User;

  return (
    <div className="flex flex-col gap-5">
      {/* Tarjeta: Información de contacto (About) */}
      <section className="overflow-hidden font-heading rounded-xl border border-border bg-card">
        <h2 className="px-5 py-3 border-b border-border text-sm font-medium text-foreground">
          Información general
        </h2>

        <div className="p-5 flex flex-col gap-3.5 text-sm">
          {/* Tipo de cliente */}
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <KindIcon className="size-4 shrink-0 text-muted-foreground/70" />
            <span className="text-foreground">
              {customer.kind === "empresa"
                ? "Empresa / Persona jurídica"
                : "Persona natural"}
            </span>
          </div>

          {/* Correo */}
          <div className="flex items-center gap-2.5">
            <Mail className="size-4 shrink-0 text-muted-foreground/70" />
            {customer.email ? (
              <a
                href={`mailto:${customer.email}`}
                className="truncate text-foreground hover:text-primary hover:underline transition-colors"
              >
                {customer.email}
              </a>
            ) : (
              <span className="text-muted-foreground italic">Sin correo</span>
            )}
          </div>

          {/* Teléfono */}
          <div className="flex items-center gap-2.5">
            <Phone className="size-4 shrink-0 text-muted-foreground/70" />
            {customer.phone ? (
              <a
                href={`tel:${customer.phone.replace(/\s/g, "")}`}
                className="text-foreground hover:text-primary hover:underline transition-colors"
              >
                {customer.phone}
              </a>
            ) : (
              <span className="text-muted-foreground italic">Sin teléfono</span>
            )}
          </div>

          {/* Documento */}
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <IdCard className="size-4 shrink-0 text-muted-foreground/70" />
            <span className="text-foreground">
              {customer.documentNumber
                ? `${customer.documentType}: ${customer.documentNumber}`
                : "Sin documento"}
            </span>
          </div>

          {/* Canal preferido */}
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <Store className="size-4 shrink-0 text-muted-foreground/70" />
            <span className="text-foreground">
              Canal: {crmChannelLabel(customer.preferredChannel)}
            </span>
          </div>

          {/* Dirección principal */}
          {address && (
            <div className="flex items-start gap-2.5 text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground/70" />
              <span className="text-foreground">
                {address.address}
                {address.district ? `, ${address.district}` : ""}
                {address.city ? `, ${address.city}` : ""}
              </span>
            </div>
          )}

          {/* Fecha de registro */}
          <div className="flex items-center gap-2.5 border-t border-border pt-3 text-sm text-muted-foreground">
            <Calendar className="size-4 shrink-0 text-muted-foreground/70" />
            <span>
              Registrado el{" "}
              {new Intl.DateTimeFormat("es-PE", {
                dateStyle: "medium",
              }).format(new Date(customer.createdAt))}
            </span>
          </div>
        </div>
      </section>

      {/* Tarjeta: Etiquetas y Segmentación (Organizations en la imagen) */}
      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <h2 className="px-5 py-3 border-b border-border text-sm font-medium text-foreground">
          Etiquetas y Segmentos
        </h2>

        <div className="p-5 flex flex-wrap gap-1.5">
          {customer.tags.length > 0 ? (
            customer.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2 py-2 leading-none text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <Tag className="size-3.5 text-primary" />
                {tag}
              </span>
            ))
          ) : (
            <p className="text-xs text-muted-foreground italic">
              Sin etiquetas asignadas.
            </p>
          )}
        </div>
      </section>

      {/* Tarjeta: Notas internas */}
      {customer.notes && (
        <section className="overflow-hidden rounded-xl border border-border bg-card font-heading">
          <h2 className="text-sm font-semibold text-foreground px-5 py-3 border-b border-border">
            Notas internas
          </h2>
          <div className="text-sm p-5 leading-relaxed text-muted-foreground">
            {customer.notes}
          </div>
        </section>
      )}
    </div>
  );
}
