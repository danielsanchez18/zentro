"use client";
import { useEffect, useState } from "react";
import { catalogProducts, type ProductVariant } from "@/lib/mock/catalog";
import { posServicePoints, type PosCustomer } from "@/lib/mock/pos";
import type { CustomerOrder } from "@/lib/mock/orders";
import { useOrdersStore } from "@/stores/orders-store";
import { usePosStore } from "@/stores/pos-store";
import { useDashboardStore } from "@/stores/dashboard-store";
import { useWorkspaceContext } from "@/stores/workspace-context-store";
import { toastMsg } from "@/components/ui/toast-message";
import { Button } from "@/components/ui/button";
import type { PosServiceType } from "../shared/types";
import { PosHeader } from "./PosHeader";
import { ProductBrowser } from "./ProductBrowser";
import { CartPanel } from "../cart/CartPanel";
import { DiscountDialog } from "../cart/DiscountDialog";
import { CheckoutDialog } from "../checkout/CheckoutDialog";
import { SaleResultDialog } from "../checkout/SaleResultDialog";
import { SuspendedSalesDialog } from "../suspended/SuspendedSalesDialog";
import { ServicePointDialog } from "../service-points/ServicePointDialog";

export function PosModule({ slug }: { slug: string }) {
  const store = usePosStore();
  const addOrder = useOrdersStore((state) => state.addOrder);
  const organizations = useDashboardStore((state) => state.organizations);
  const locations = useDashboardStore((state) => state.branches);
  const selectedByOrganization = useWorkspaceContext(
    (state) => state.activeLocationByOrganization,
  );
  const setActiveLocation = useWorkspaceContext(
    (state) => state.setActiveLocation,
  );
  const organization = organizations.find((item) => item.slug === slug);
  const availableLocations = locations.filter(
    (item) =>
      item.organizationId === organization?.id && item.status === "ACTIVE",
  );
  const selectedId = organization
    ? selectedByOrganization[organization.id]
    : null;
  const activeLocation =
    availableLocations.find((item) => item.id === selectedId) ??
    (availableLocations.length === 1 ? availableLocations[0] : undefined);
  useEffect(() => {
    if (organization && !selectedId && availableLocations.length === 1)
      setActiveLocation(organization.id, availableLocations[0].id);
  }, [availableLocations, organization, selectedId, setActiveLocation]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [serviceType, setServiceType] = useState<PosServiceType>("mesa");
  const [customer, setCustomer] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<PosCustomer>();
  const [reference, setReference] = useState("");
  const [servicePointId, setServicePointId] = useState("");
  const [servicePoints, setServicePoints] = useState(() =>
    posServicePoints.map((point) => ({ ...point })),
  );
  const [servicePointOpen, setServicePointOpen] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [discountOpen, setDiscountOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [suspendedOpen, setSuspendedOpen] = useState(false);
  const [result, setResult] = useState<{
    id: string;
    number: string;
    total: number;
    paidAmount: number;
  } | null>(null);
  const subtotal = store.lines.reduce(
    (sum, line) => sum + line.unitPrice * line.quantity,
    0,
  );
  const total = Math.max(0, subtotal - discount);
  const selectedPoint = servicePoints.find(
    (point) => point.id === servicePointId,
  );
  const addProduct = (productId: string, variant?: ProductVariant) => {
    const product = catalogProducts.find((item) => item.id === productId);
    if (!product) return;
    store.addLine({
      productId,
      name: product.name,
      variantId: variant?.id,
      variantLabel: variant?.label,
      unitPrice: (variant?.priceOverride ?? product.basePrice) / 100,
      stock: 24,
    });
  };
  const validAttention =
    serviceType === "mesa"
      ? Boolean(servicePointId)
      : serviceType === "delivery"
        ? customer.trim() && reference.trim()
        : true;
  const suspend = () => {
    const name = window.prompt("Nombre o referencia de la venta");
    if (name && store.suspend(name)) {
      setDiscount(0);
      toastMsg.success(
        "Venta suspendida",
        "Podrás recuperarla desde esta terminal.",
      );
    }
  };
  const confirm = (
    payments: {
      method: "efectivo" | "tarjeta" | "yape" | "plin" | "transferencia";
      amount: number;
      reference: string;
    }[],
    receipt: "boleta" | "factura",
    document: string,
  ) => {
    const now = new Date().toISOString();
    const id = `ord_pos_${Date.now()}`;
    const number = `PED-${String(Date.now()).slice(-5)}`;
    const paidAmount = Math.min(total, payments.reduce((sum, payment) => sum + payment.amount, 0));
    const point = servicePoints.find((item) => item.id === servicePointId);
    const order: CustomerOrder = {
      id,
      number,
      customerName: customer.trim() || point?.name || reference.trim() || "Cliente invitado",
      customerEmail: selectedCustomer?.email,
      customerPhone: serviceType === "delivery" ? reference : undefined,
      serviceType,
      channel: "pos",
      tableName: serviceType === "mesa" ? point?.name : undefined,
      servicePointId: point?.id,
      servicePointName: point?.name,
      deliveryAddress: serviceType === "delivery" ? reference : undefined,
      status: "confirmado",
      paymentStatus: paidAmount <= 0 ? "pago_pendiente" : paidAmount >= total ? "pagado" : "pago_parcial",
      paymentMethod: payments.at(-1)?.method,
      paidAmount,
      payments: payments.map((payment, index) => ({
        id: `pay_${Date.now()}_${index}`,
        amount: payment.amount,
        method: payment.method,
        reference: payment.reference || undefined,
        createdAt: now,
      })),
      receipt: paidAmount >= total ? {
        type: receipt,
        number: `${receipt === "factura" ? "F001" : "B001"}-${String(Date.now()).slice(-6)}`,
        customerDocument: document || undefined,
        issuedAt: now,
      } : undefined,
      manualDiscount: discount,
      lines: store.lines.map((line) => ({
        id: line.id,
        productId: line.productId,
        name: line.name + (line.variantLabel ? ` · ${line.variantLabel}` : ""),
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        discount: 0,
        total: line.unitPrice * line.quantity,
        notes: line.note || undefined,
      })),
      subtotal,
      discount,
      deliveryFee: 0,
      total,
      promisedAt: new Date(Date.now() + 30 * 60000).toISOString(),
      createdAt: now,
      updatedAt: now,
    };
    addOrder(order);
    store.clear();
    setCheckoutOpen(false);
    setResult({ id, number, total, paidAmount });
  };
  const openOrder = () => confirm([], "boleta", "");
  const reset = () => {
    setResult(null);
    setCustomer("");
    setSelectedCustomer(undefined);
    setReference("");
    setDiscount(0);
    setServiceType("mesa");
    setServicePointId("");
  };
  if (!activeLocation)
    return (
      <div className="w-full px-5 py-7 md:px-7 xl:px-10">
        <div className="mx-auto max-w-xl rounded-xl border p-6">
          <h1 className="text-lg font-medium">Elige dónde operar el POS</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            El punto de venta necesita una ubicación concreta.
          </p>
          <div className="mt-5 flex flex-col gap-2">
            {availableLocations.length ? (
              availableLocations.map((item) => (
                <Button
                  key={item.id}
                  variant="outline"
                  className="justify-start"
                  onClick={() =>
                    organization && setActiveLocation(organization.id, item.id)
                  }
                >
                  {item.name}
                </Button>
              ))
            ) : (
              <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                Esta organización todavía no tiene una ubicación habilitada para
                operar.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  return (
    <div className="w-full px-5 py-7 md:px-7 xl:px-10">
      <PosHeader
        location={activeLocation.name}
        suspendedCount={store.suspended.length}
        onSuspended={() => setSuspendedOpen(true)}
      />
      <div className="mt-7 flex flex-col gap-6 lg:flex-row lg:items-start">
        <ProductBrowser
          query={query}
          category={category}
          onQuery={setQuery}
          onCategory={setCategory}
          onAdd={addProduct}
        />
        <CartPanel
          lines={store.lines}
          serviceType={serviceType}
          customer={customer}
          reference={reference}
          discount={discount}
          selectedPoint={selectedPoint}
          onServiceType={setServiceType}
          onCustomer={(value) => {
            setCustomer(value);
            setSelectedCustomer(undefined);
          }}
          onCustomerSelect={(value) => {
            setSelectedCustomer(value);
            setCustomer(value.name);
          }}
          onReference={setReference}
          onQuantity={store.setQuantity}
          onNote={store.setNote}
          onRemove={store.removeLine}
          onDiscount={() => setDiscountOpen(true)}
          onSelectPoint={() => setServicePointOpen(true)}
          onSuspend={suspend}
          onOpenOrder={() => validAttention ? openOrder() : toastMsg.error("Completa la atención", "Selecciona el punto de atención.")}
          onCheckout={() =>
            validAttention
              ? setCheckoutOpen(true)
              : toastMsg.error(
                  "Completa la atención",
                  "Selecciona el punto de atención.",
                )
          }
        />
      </div>
      {discountOpen && (
        <DiscountDialog
          open
          subtotal={subtotal}
          value={discount}
          onOpenChange={setDiscountOpen}
          onApply={(value) => {
            setDiscount(value);
            setDiscountOpen(false);
          }}
        />
      )}
      {checkoutOpen && (
        <CheckoutDialog
          open
          total={total}
          onOpenChange={setCheckoutOpen}
          onConfirm={confirm}
        />
      )}
      <ServicePointDialog
        open={servicePointOpen}
        slug={slug}
        points={servicePoints}
        selectedId={servicePointId}
        onOpenChange={setServicePointOpen}
        onPointsChange={setServicePoints}
        onSelect={setServicePointId}
      />
      <SuspendedSalesDialog
        open={suspendedOpen}
        sales={store.suspended}
        onOpenChange={setSuspendedOpen}
        onResume={(id) => {
          store.resume(id);
          setSuspendedOpen(false);
        }}
        onDiscard={store.discard}
      />
      {result && (
        <SaleResultDialog
          open
          slug={slug}
          orderId={result.id}
          number={result.number}
          total={result.total}
          paidAmount={result.paidAmount}
          onNewSale={reset}
        />
      )}
    </div>
  );
}
