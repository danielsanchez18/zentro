"use client";

import { useState } from "react";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import { toastMsg } from "@/components/ui/toast-message";
import { type CashPaymentMethod } from "@/lib/mock/cash";
import { useCashStore } from "@/stores/cash-store";

function YapeLogo() {
  return (
    <div className="size-10 rounded-lg bg-[#742284] flex items-center justify-center shrink-0">
      <svg viewBox="0 0 36 36" fill="none" className="size-6 text-white">
        <path
          d="M10 10L16.8 19.5V26H19.2V19.5L26 10H22.6L18 16.5L13.4 10H10Z"
          fill="currentColor"
        />
        <circle cx="25" cy="9.5" r="2.2" fill="#00D2C4" />
      </svg>
    </div>
  );
}

function PlinLogo() {
  return (
    <div className="size-10 rounded-lg bg-[#00D2C4] flex items-center justify-center shrink-0">
      <svg viewBox="0 0 36 36" fill="none" className="size-6 text-white">
        <path
          d="M11 20C11 15.58 14.58 12 19 12H25M25 12L21.5 8.5M25 12L21.5 15.5"
          stroke="white"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M25 16C25 20.42 21.42 24 17 24H11M11 24L14.5 20.5M11 24L14.5 27.5"
          stroke="white"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function CardLogo() {
  return (
    <div className="size-10 rounded-lg bg-neutral-900 dark:bg-neutral-800 flex items-center justify-center shrink-0 border border-white/10">
      <svg viewBox="0 0 36 36" fill="none" className="size-6">
        <rect
          x="6"
          y="9"
          width="24"
          height="18"
          rx="3"
          stroke="#CBD5E1"
          strokeWidth="1.8"
        />
        <line
          x1="6"
          y1="14"
          x2="30"
          y2="14"
          stroke="#64748B"
          strokeWidth="2.5"
        />
        <circle cx="15" cy="21.5" r="3" fill="#EB001B" />
        <circle cx="20" cy="21.5" r="3" fill="#F79E1B" fillOpacity="0.85" />
      </svg>
    </div>
  );
}

function CashLogo() {
  return (
    <div className="size-10 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
      <svg viewBox="0 0 36 36" fill="none" className="size-6 text-white">
        <rect
          x="6"
          y="10"
          width="24"
          height="16"
          rx="2.5"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="18" cy="18" r="3.5" stroke="currentColor" strokeWidth="2" />
        <path
          d="M10 14V22M26 14V22"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function BankLogo() {
  return (
    <div className="size-10 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
      <svg viewBox="0 0 36 36" fill="none" className="size-6 text-white">
        <path d="M8 14L18 8L28 14H8Z" fill="currentColor" />
        <rect x="10" y="16" width="3" height="8" rx="0.5" fill="currentColor" />
        <rect
          x="16.5"
          y="16"
          width="3"
          height="8"
          rx="0.5"
          fill="currentColor"
        />
        <rect x="23" y="16" width="3" height="8" rx="0.5" fill="currentColor" />
        <rect
          x="7"
          y="25"
          width="22"
          height="2.5"
          rx="0.5"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

interface PaymentMethodDetail {
  id: CashPaymentMethod;
  name: string;
  connectLabel: string;
  logo: React.ComponentType;
  shortFeatures: string[];
  description: string;
  settlementTime: string;
  commission: string;
  compatibility: string;
  requirements: string[];
  fullFeatures: string[];
}

const paymentMethodsList: PaymentMethodDetail[] = [
  {
    id: "yape",
    name: "Yape",
    connectLabel: "Conectar con Yape",
    logo: YapeLogo,
    shortFeatures: [
      "Cobros con código QR o número celular. Acreditación inmediata en cuenta BCP",
    ],
    description:
      "Yape es la billetera digital líder en el Perú. Permite cobros rápidos mediante lectura de código QR dinámico o transferencias directas por número de teléfono sin demoras en caja.",
    settlementTime: "Inmediata (24/7)",
    commission: "0% por transacción estándar",
    compatibility: "BCP, Yape con DNI y bancos interoperables",
    requirements: [
      "Número celular o cuenta BCP activa vinculada",
      "Código QR visible en el mostrador o pantalla POS",
      "Validación de notificación de abono en pantalla",
    ],
    fullFeatures: [
      "Confirmación y acreditación instantánea de los fondos",
      "Límite diario acumulado de hasta S/. 2,000 por operación",
      "Interoperabilidad total con usuarios de Plin y otras entidades",
      "Registro trazable con número de celular y código de aprobación",
    ],
  },
  {
    id: "plin",
    name: "Plin",
    connectLabel: "Conectar con Plin",
    logo: PlinLogo,
    shortFeatures: [
      "Transferencias interbancarias sin costo. Compatible con BBVA, Interbank y Scotiabank",
    ],
    description:
      "Plin permite a clientes de múltiples entidades financieras transferir fondos al instante sin comisiones interbancarias, facilitando el cobro ágil desde múltiples bancos nacionales.",
    settlementTime: "Inmediata (24/7)",
    commission: "0% sin comisiones interbancarias",
    compatibility: "BBVA, Interbank, Scotiabank, BanBif, Caja Arequipa",
    requirements: [
      "Cuenta en banco asociado afiliada a Plin",
      "Recepción y verificación del mensaje de confirmación",
    ],
    fullFeatures: [
      "Transferencias inmediatas entre diferentes bancos sin cobro adicional",
      "Soporte para cobro con QR impreso o en pantalla del punto de venta",
      "Interoperable con Yape para recibir pagos de cualquier billetera",
      "Registro del número de operación para cuadres de turno",
    ],
  },
  {
    id: "tarjeta",
    name: "Tarjeta de crédito y débito",
    connectLabel: "Conectar POS",
    logo: CardLogo,
    shortFeatures: [
      "Terminales POS Visa, Mastercard y Amex. Liquidación bancaria en 24 a 48 horas",
    ],
    description:
      "Acepta pagos con tarjetas de débito y crédito nacionales e internacionales a través de terminales POS inalámbricos o fijos integrados a la operativa del negocio.",
    settlementTime: "24 a 48 horas hábiles",
    commission: "2.8% a 3.5% + IGV (según operador POS)",
    compatibility: "Visa, Mastercard, American Express, Diners Club",
    requirements: [
      "Terminal POS activo (Niubiz, Izipay o Mercado Pago)",
      "Registro del número de lote y referencia del voucher emitido",
    ],
    fullFeatures: [
      "Cobro sin contacto (Contactless), chip EMV y billeteras Apple Pay / Google Pay",
      "Aceptación de tarjetas de débito y crédito nacionales y extranjeras",
      "Cierre de lote diario automático para conciliación bancaria",
      "Impresión o envío digital del comprobante de venta (voucher)",
    ],
  },
  {
    id: "efectivo",
    name: "Efectivo",
    connectLabel: "Habilitar Efectivo",
    logo: CashLogo,
    shortFeatures: [
      "Cobro directo y arqueo en gaveta física. Disponibilidad inmediata sin comisiones",
    ],
    description:
      "Cobro tradicional en moneda física (soles). Requiere control riguroso de apertura de turno, arqueos periódicos y cálculo de vuelto en cada transacción.",
    settlementTime: "Inmediata en caja física",
    commission: "0% sin comisiones financieras",
    compatibility: "Billetes y monedas de curso legal (PEN)",
    requirements: [
      "Gaveta portadinero con llave o apertura electrónica",
      "Fondo inicial de apertura para cambio y vuelto",
    ],
    fullFeatures: [
      "Disponibilidad inmediata del 100% de los fondos cobrados",
      "Cuadre y conciliación detallada en el módulo de Arqueo y Cierre",
      "Control de retiros preventivos y gastos menores de caja chica",
      "Operatividad garantizada aún sin conexión a internet",
    ],
  },
  {
    id: "transferencia",
    name: "Transferencia bancaria",
    connectLabel: "Configurar Transferencia",
    logo: BankLogo,
    shortFeatures: [
      "Depósitos a cuenta corriente o código CCI. Validación manual con comprobante de pago",
    ],
    description:
      "Depósitos directos en cuentas corrientes o transferencias interbancarias vía CCI. Es la vía recomendada para ventas corporativas, eventos o pedidos al por mayor.",
    settlementTime: "Inmediato (mismo banco) o diferido (interbancario)",
    commission: "0% o costo interbancario estándar según la entidad",
    compatibility: "Cuentas corrientes o de ahorros con CCI en cualquier banco",
    requirements: [
      "Validación del comprobante de transferencia y número de operación",
      "Confirmación de acreditación en la banca online del negocio",
    ],
    fullFeatures: [
      "Ideal para pedidos de alto volumen o clientes corporativos",
      "Sin límites de monto máximos impuestos por billeteras móviles",
      "Conciliación directa con extractos bancarios de la empresa",
      "Registro de número de operación bancaria asociado al pedido",
    ],
  },
];

export function AcceptedPaymentMethods() {
  const settings = useCashStore((state) => state.settings);
  const updateSettings = useCashStore((state) => state.updateSettings);
  const [selectedMethod, setSelectedMethod] =
    useState<PaymentMethodDetail | null>(null);

  const toggleMethod = (method: CashPaymentMethod) => {
    const isCurrentlyAccepted = settings.acceptedMethods.includes(method);
    updateSettings({
      acceptedMethods: isCurrentlyAccepted
        ? settings.acceptedMethods.filter((item) => item !== method)
        : [...settings.acceptedMethods, method],
    });
  };

  const isSelectedAccepted = selectedMethod
    ? settings.acceptedMethods.includes(selectedMethod.id)
    : false;

  return (
    <>
      <section className="rounded-xl border border-border bg-card font-heading">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="text-sm font-medium">Métodos de pago aceptados</h2>
          <span className="text-sm text-muted-foreground">
            {settings.acceptedMethods.length} activos
          </span>
        </div>
        <div className="divide-y divide-border">
          {paymentMethodsList.map((item) => {
            const { id, name, logo: Logo, connectLabel, shortFeatures } = item;
            const isAccepted = settings.acceptedMethods.includes(id);
            return (
              <div
                key={id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 px-5 py-4 hover:bg-muted/10 transition-colors"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <Logo />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-foreground truncate">
                        {name}
                      </h3>
                    </div>
                    <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                      {shortFeatures.map((feat, i) => (
                        <li key={i} className="flex gap-1.5">
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={() => setSelectedMethod(item)}
                      className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline font-sans cursor-pointer transition-colors"
                    >
                      Leer más
                      <ChevronRight className="size-3.5" />
                    </button>
                  </div>
                </div>

                <Button
                  type="button"
                  variant={isAccepted ? "outline" : "default"}
                  className={
                    isAccepted
                      ? "font-sans rounded-full shrink-0 self-start sm:self-center"
                      : "font-sans rounded-full shrink-0 self-start sm:self-center bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
                  }
                  onClick={() => {
                    toggleMethod(id);
                    if (isAccepted) {
                      toastMsg.info(
                        "Método deshabilitado",
                        `${name} ha sido desactivado`,
                      );
                    } else {
                      toastMsg.success(
                        "Método habilitado",
                        `${name} ahora está activo para cobros`,
                      );
                    }
                  }}
                >
                  {isAccepted ? "Deshabilitar" : connectLabel}
                </Button>
              </div>
            );
          })}
        </div>
      </section>

      {selectedMethod && (
        <Dialog
          open={Boolean(selectedMethod)}
          onOpenChange={(open) => !open && setSelectedMethod(null)}
        >
          <DialogContent className="sm:max-w-lg max-h-[95vh] flex flex-col">
            <DialogHeader className="gap-3 border-b border-border pb-4 text-left">
              <div className="flex items-center gap-3">
                <selectedMethod.logo />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <DialogTitle>{selectedMethod.name}</DialogTitle>
                    <StatusBadge
                      status={isSelectedAccepted ? "activa" : "inactivo"}
                      label={
                        isSelectedAccepted ? "Habilitado" : "Deshabilitado"
                      }
                    />
                  </div>
                  <DialogDescription>
                    Información operativa y especificaciones de cobro
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-1 text-sm font-heading overflow-y-auto">
              <div>
                <h4 className="font-medium mb-1">Descripción operativa</h4>
                <p className="text-muted-foreground">
                  {selectedMethod.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 rounded-lg border border-border bg-muted/20 p-3">
                <div>
                  <span className="text-muted-foreground block text-sm">
                    Liquidación
                  </span>
                  <span className="font-medium text-foreground">
                    {selectedMethod.settlementTime}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-sm">
                    Comisión estimada
                  </span>
                  <span className="font-medium text-foreground">
                    {selectedMethod.commission}
                  </span>
                </div>
                <div className="col-span-2 border-t border-border/50 pt-2 mt-0.5">
                  <span className="text-muted-foreground block text-sm">
                    Compatibilidad
                  </span>
                  <span className="font-medium text-foreground">
                    {selectedMethod.compatibility}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-foreground font-heading mb-2">
                  Características principales
                </h4>
                <ul className="space-y-1.5 text-sm font-heading text-muted-foreground">
                  {selectedMethod.fullFeatures.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-2 size-1 rounded-full bg-primary shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium text-foreground font-heading mb-2">
                  Requisitos de cobro
                </h4>
                <ul className="space-y-1.5 text-sm font-heading text-muted-foreground">
                  {selectedMethod.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedMethod(null)}
                className="rounded-full"
              >
                Cerrar
              </Button>
              <Button
                type="button"
                variant={isSelectedAccepted ? "outline" : "default"}
                className={
                  isSelectedAccepted
                    ? "rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/40"
                    : "rounded-full bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900"
                }
                onClick={() => {
                  toggleMethod(selectedMethod.id);
                  if (isSelectedAccepted) {
                    toastMsg.info(
                      "Método deshabilitado",
                      `${selectedMethod.name} ha sido desactivado`,
                    );
                  } else {
                    toastMsg.success(
                      "Método habilitado",
                      `${selectedMethod.name} ahora está activo para cobros`,
                    );
                  }
                }}
              >
                {isSelectedAccepted
                  ? "Deshabilitar método"
                  : selectedMethod.connectLabel}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
