"use client";

import { useRouter } from "next/navigation";
import { Toast } from "@/components/app/shared/Toast";
import { Button } from "@/components/ui/button";
import { toastMsg } from "@/components/ui/toast-message";
import { useCrmStore } from "@/stores/crm-store";
import { CustomerForm, type CustomerFormValues } from "../shared/CustomerForm";

const toCustomer = (values: CustomerFormValues) => {
  const now = new Date().toISOString();
  return {
    id: `customer_${Date.now()}`,
    kind: values.kind,
    name: values.name.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    documentType: values.documentType,
    documentNumber: values.documentNumber || undefined,
    status: values.status,
    preferredChannel: values.preferredChannel,
    tags: values.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    notes: values.notes.trim() || undefined,
    addresses: values.address.trim()
      ? [
          {
            id: `addr_${Date.now()}`,
            label: "Principal",
            address: values.address.trim(),
            district: values.district.trim(),
            city: values.city.trim(),
            reference: values.reference.trim() || undefined,
            isDefault: true,
          },
        ]
      : [],
    totalOrders: 0,
    totalSpent: 0,
    createdAt: now,
    updatedAt: now,
    activity: [
      {
        id: `act_${Date.now()}`,
        type: "creacion" as const,
        title: "Cliente creado",
        description: "Perfil registrado manualmente en CRM.",
        createdAt: now,
      },
    ],
  };
};

export function AddCustomerPage({ slug }: { slug: string }) {
  const router = useRouter();
  const customers = useCrmStore((state) => state.customers);
  const add = useCrmStore((state) => state.addCustomer);
  const href = `/app/${slug}/clientes`;
  const id = "add-customer-form";
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
          <h1 className="text-lg font-medium">Nuevo cliente</h1>
        </div>
      </header>
      <div>
        <CustomerForm
          id={id}
          existingEmails={customers.map((customer) => customer.email)}
          onSubmit={(values) => {
            const customer = toCustomer(values);
            add(customer);
            toastMsg.success(
              "Cliente creado",
              `${customer.name} ya está disponible en CRM y POS.`,
            );
            router.push(`${href}/${customer.id}`);
          }}
        />
      </div>
      <div className="sticky bottom-5 z-40 mx-auto mt-7 w-fit">
        <Toast
          formId={id}
          submitLabel="Guardar cliente"
          onCancel={() => router.push(href)}
        />
      </div>
    </div>
  );
}
