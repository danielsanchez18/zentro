"use client";

import { useRouter } from "next/navigation";
import { Toast } from "@/components/app/shared/Toast";
import { Button } from "@/components/ui/button";
import { toastMsg } from "@/components/ui/toast-message";
import { useCrmStore } from "@/stores/crm-store";
import { CustomerForm, customerToForm } from "../shared/CustomerForm";

export function EditCustomerPage({
  slug,
  customerId,
}: {
  slug: string;
  customerId: string;
}) {
  const router = useRouter();
  const customers = useCrmStore((state) => state.customers);
  const update = useCrmStore((state) => state.updateCustomer);
  const customer = customers.find((item) => item.id === customerId);
  const href = `/app/${slug}/clientes/${customerId}`;
  const id = "edit-customer-form";

  if (!customer) {
    return <div className="p-7 text-sm text-muted-foreground">Cliente no encontrado.</div>;
  }

  return (
    <div className="w-full px-5 py-7 md:px-7 xl:px-10">
      <header className="mb-7 flex items-end justify-between gap-4">
        <div>
          <Button
            type="button"
            variant="link"
            onClick={() => router.push(href)}
            className="h-auto px-0"
          >
            Regresar
          </Button>
          <h1 className="text-lg font-medium">Editar cliente</h1>
        </div>
      </header>

      <div>
        <CustomerForm
          id={id}
          initial={customerToForm(customer)}
          existingEmails={customers
            .filter((item) => item.id !== customer.id)
            .map((item) => item.email)}
          onSubmit={(values) => {
            const currentAddress = customer.addresses.find(
              (address) => address.isDefault,
            );
            update(customer.id, {
              ...values,
              email: values.email.trim(),
              phone: values.phone.trim(),
              documentNumber: values.documentNumber || undefined,
              tags: values.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
              notes: values.notes || undefined,
              addresses: values.address
                ? [
                    {
                      id: currentAddress?.id ?? `addr_${Date.now()}`,
                      label: currentAddress?.label ?? "Principal",
                      address: values.address,
                      district: values.district,
                      city: values.city,
                      reference: values.reference || undefined,
                      isDefault: true,
                    },
                    ...customer.addresses.filter(
                      (address) => address.id !== currentAddress?.id,
                    ),
                  ]
                : [],
            });
            toastMsg.success(
              "Cliente actualizado",
              `Se guardaron los cambios de ${values.name}.`,
            );
            router.push(href);
          }}
        />
      </div>

      <div className="sticky bottom-5 z-40 mx-auto mt-7 w-fit">
        <Toast
          formId={id}
          submitLabel="Guardar cambios"
          onCancel={() => router.push(href)}
        />
      </div>
    </div>
  );
}
