"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/app/shared/Toast";
import { ConfirmDialog } from "@/components/app/team/ConfirmDialog";
import { toastMsg } from "@/components/ui/toast-message";
import { orders } from "@/lib/mock/orders";
import { useCrmStore } from "@/stores/crm-store";
import { CustomerHeader, type CustomerDetailTab } from "./CustomerHeader";
import { CustomerInfo } from "./CustomerInfo";
import { CustomerCommercial } from "./CustomerCommercial";
import { CustomerAddresses } from "./CustomerAddresses";
import { CustomerOrders } from "./CustomerOrders";
import { CustomerHistory } from "./CustomerHistory";

export function CustomerDetailPage({
  slug,
  customerId,
}: {
  slug: string;
  customerId: string;
}) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<CustomerDetailTab>("general");

  const customers = useCrmStore((state) => state.customers);
  const update = useCrmStore((state) => state.updateCustomer);
  const remove = useCrmStore((state) => state.removeCustomer);
  const customer = customers.find((item) => item.id === customerId);
  const root = `/app/${slug}/clientes`;

  if (!customer) {
    return (
      <div className="w-full p-7">
        <Button
          variant="link"
          onClick={() => router.push(root)}
          className="px-0 text-muted-foreground hover:text-foreground"
        >
          ← Regresar a clientes
        </Button>
        <div className="mt-6 rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          No encontramos este cliente.
        </div>
      </div>
    );
  }

  const related = orders.filter(
    (order) =>
      (customer.email &&
        order.customerEmail?.toLowerCase() === customer.email.toLowerCase()) ||
      (customer.phone && order.customerPhone === customer.phone) ||
      order.customerName.toLowerCase() === customer.name.toLowerCase(),
  );

  const toggle = () => {
    const status = customer.status === "activo" ? "inactivo" : "activo";
    update(customer.id, {
      status,
      activity: [
        {
          id: `act_${Date.now()}`,
          type: "actualizacion",
          title:
            status === "activo"
              ? "Cliente habilitado"
              : "Cliente deshabilitado",
          description:
            status === "activo"
              ? "El perfil volvió a estar disponible en los canales."
              : "El perfil dejó de estar disponible para nuevas ventas.",
          createdAt: new Date().toISOString(),
        },
        ...customer.activity,
      ],
    });
    toastMsg.success(
      status === "activo" ? "Cliente habilitado" : "Cliente deshabilitado",
      customer.name,
    );
  };

  return (
    <div className="w-full space-y-6 px-5 py-7 md:px-7 xl:px-10">
      {/* Botón superior de retorno */}
      <div>
        <Button
          type="button"
          variant="link"
          onClick={() => router.push(root)}
          className="h-auto px-0 text-sm"
        >
          Regresar a clientes
        </Button>
      </div>

      {/* Banner de cabecera con avatar sobrepuesto y pestañas (Estilo Preline de referencia) */}
      <CustomerHeader
        customer={customer}
        relatedOrdersCount={related.length}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onEdit={() => router.push(`${root}/${customer.id}/editar`)}
        onToggleStatus={toggle}
        onDelete={() => setDeleteOpen(true)}
      />

      {/* Grid de 2 columnas (Sidebar a la izquierda + Contenido dinámico a la derecha) */}
      <div className="grid items-start gap-6 xl:grid-cols-[21rem_1fr] lg:grid-cols-[19rem_1fr]">
        {/* Columna Izquierda: Información de contacto y notas */}
        <aside className="xl:sticky xl:top-5">
          <CustomerInfo customer={customer} />
        </aside>

        {/* Columna Derecha: Dashboard comercial, pedidos y actividad */}
        <main className="flex min-w-0 flex-col gap-6">
          {activeTab === "general" && (
            <>
              <CustomerCommercial customer={customer} />
              <CustomerOrders
                orders={related}
                onOpen={(id) => router.push(`/app/${slug}/pedidos/${id}`)}
              />
              <CustomerAddresses
                addresses={customer.addresses}
                customerName={customer.name}
                customerPhone={customer.phone}
                customerId={customer.id}
              />
              <CustomerHistory
                activity={customer.activity}
                customerName={customer.name}
                onOpenOrder={(id) => router.push(`/app/${slug}/pedidos/${id}`)}
              />
            </>
          )}

          {activeTab === "pedidos" && (
            <>
              <CustomerCommercial customer={customer} />
              <CustomerOrders
                orders={related}
                onOpen={(id) => router.push(`/app/${slug}/pedidos/${id}`)}
              />
            </>
          )}

          {activeTab === "direcciones" && (
            <CustomerAddresses
              addresses={customer.addresses}
              customerName={customer.name}
              customerPhone={customer.phone}
              customerId={customer.id}
            />
          )}

          {activeTab === "actividad" && (
            <CustomerHistory
              activity={customer.activity}
              customerName={customer.name}
              onOpenOrder={(id) => router.push(`/app/${slug}/pedidos/${id}`)}
            />
          )}
        </main>
      </div>

      {/* Barra flotante inferior de acciones */}
      <div className="sticky bottom-5 z-40 mx-auto w-fit">
        <Toast ariaLabel="Acciones del cliente">
          <Button
            variant="link"
            onClick={() => router.push(`${root}/${customer.id}/editar`)}
            className="cursor-pointer px-3 text-green-500"
          >
            Editar
          </Button>
          <Button
            variant="link"
            onClick={toggle}
            className="cursor-pointer px-3 text-white"
          >
            {customer.status === "activo" ? "Deshabilitar" : "Habilitar"}
          </Button>
          <Button
            variant="link"
            onClick={() => setDeleteOpen(true)}
            className="cursor-pointer px-3 text-rose-400"
          >
            Eliminar
          </Button>
        </Toast>
      </div>

      {/* Diálogo de confirmación de eliminación */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Eliminar cliente"
        description={`Se eliminará ${customer.name} del prototipo. El historial de pedidos no será eliminado.`}
        confirmLabel="Eliminar"
        onConfirm={() => {
          remove(customer.id);
          toastMsg.info("Cliente eliminado", customer.name);
          router.push(root);
        }}
      />
    </div>
  );
}
