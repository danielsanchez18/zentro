"use client";

import { useState } from "react";
import { Info, Package2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toastMsg } from "@/components/ui/toast-message";
import { type CashTerminal } from "@/lib/mock/cash";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import { useCashStore } from "@/stores/cash-store";
import { TerminalDialog } from "./TerminalDialog";
import { AcceptedPaymentMethods } from "./AcceptedPaymentMethods";

export function CashSettingsModule({ slug }: { slug: string }) {
  const router = useRouter();
  const terminals = useCashStore((state) => state.terminals);
  const sessions = useCashStore((state) => state.sessions);
  const settings = useCashStore((state) => state.settings);
  const updateSettings = useCashStore((state) => state.updateSettings);
  const updateTerminal = useCashStore((state) => state.updateTerminal);
  const removeTerminal = useCashStore((state) => state.removeTerminal);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CashTerminal | null>(null);

  return (
    <div className="w-full space-y-7 px-5 py-7 md:px-7 xl:px-10">
      <header>
        <Button
          variant="link"
          className="h-auto px-0"
          onClick={() => router.push(`/app/${slug}/caja`)}
        >
          Regresar
        </Button>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-medium">Configuración de caja</h1>
            <p className="text-sm text-muted-foreground">
              Terminales y reglas operativas de la ubicación activa.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
            className="rounded-full"
          >
            Nueva terminal
          </Button>
        </div>
      </header>
      <div className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
        <section className="rounded-xl border border-border bg-card font-heading">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <h2 className="text-sm font-medium">Terminales</h2>
          </div>
          <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            {terminals.map((terminal) => {
              const hasHistory = sessions.some(
                (session) => session.terminalId === terminal.id,
              );
              const isOpen = sessions.some(
                (session) =>
                  session.terminalId === terminal.id &&
                  session.status === "abierta",
              );
              return (
                <article
                  key={terminal.id}
                  className="rounded-xl border border-border p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="p-2.5 rounded-lg bg-accent shrink-0">
                          <Package2 className="size-4.5" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {terminal.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {terminal.locationName}
                          </p>
                        </div>
                      </div>

                      <StatusBadge
                        status={
                          isOpen
                            ? "activa"
                            : terminal.active
                              ? "finalizada"
                              : "inactivo"
                        }
                        label={
                          isOpen
                            ? "Abierta"
                            : terminal.active
                              ? "Cerrada"
                              : "Deshabilitada"
                        }
                      />
                    </div>

                    {isOpen ? (
                      <div className="mt-3 flex items-start gap-2.5 rounded-lg border border-border bg-muted/40 p-2.5 text-sm font-medium text-muted-foreground font-sans">
                        <Info className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                        <p>
                          Para realizar una operación primero debes cerrar la
                          caja.
                        </p>
                      </div>
                    ) : (
                      <div className="mt-3 px-3 py-2 rounded-lg border border-border flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {terminal.active
                            ? "Terminal habilitada"
                            : "Terminal deshabilitada"}
                        </span>
                        <Switch
                          checked={terminal.active}
                          onCheckedChange={(active) => {
                            updateTerminal(terminal.id, { active });
                            toastMsg.info(
                              active
                                ? "Terminal habilitada"
                                : "Terminal deshabilitada",
                              terminal.name,
                            );
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-3 w-full">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isOpen}
                      title={
                        isOpen ? "Debes cerrar la caja para editar" : undefined
                      }
                      onClick={() => {
                        setEditing(terminal);
                        setDialogOpen(true);
                      }}
                      className="disabled:opacity-50"
                    >
                      Editar
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={hasHistory || isOpen}
                      title={
                        isOpen
                          ? "Debes cerrar la caja para eliminar"
                          : hasHistory
                            ? "No puede eliminarse porque tiene sesiones asociadas"
                            : "Eliminar terminal"
                      }
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 disabled:opacity-50"
                      onClick={() => {
                        removeTerminal(terminal.id);
                        toastMsg.info("Terminal eliminada", terminal.name);
                      }}
                    >
                      Eliminar
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
        <div className="flex flex-col gap-5">
          <section className="rounded-xl border border-border bg-card font-heading">
            <div className="border-b border-border px-5 py-3">
              <h2 className="text-sm font-medium">Política operativa</h2>
            </div>
            <div className="space-y-6 p-5">
              {[
                {
                  key: "requireOpenSessionForCash",
                  title: "Exigir caja para efectivo",
                  description:
                    "Los cobros en efectivo necesitan una sesión abierta.",
                },
                {
                  key: "requireOpenSessionForDigital",
                  title: "Exigir caja para pagos digitales",
                  description:
                    "Tarjeta, billeteras y transferencias también requieren sesión.",
                },
                {
                  key: "requireClosingNotesOnDifference",
                  title: "Explicar diferencias",
                  description:
                    "Solicita una observación cuando el arqueo no cuadra.",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <Switch
                    checked={Boolean(
                      settings[item.key as keyof typeof settings],
                    )}
                    onCheckedChange={(value) =>
                      updateSettings({ [item.key]: value })
                    }
                  />
                </div>
              ))}
            </div>
          </section>
          <AcceptedPaymentMethods />
        </div>
      </div>
      {dialogOpen && (
        <TerminalDialog
          key={editing?.id ?? "new"}
          onOpenChange={setDialogOpen}
          terminal={editing}
        />
      )}
    </div>
  );
}
