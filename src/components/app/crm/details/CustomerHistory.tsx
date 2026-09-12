"use client";

import { useState } from "react";
import {
  Clock,
  Calendar,
  DollarSign,
  CheckCircle2,
  PhoneCall,
  FileText,
  SlidersHorizontal,
  Play,
  Pause,
  Landmark,
  UserCheck,
  Sparkles,
  ArrowRight,
  Zap,
} from "lucide-react";
import type { CustomerActivity } from "@/lib/mock/crm";
import { formatOrderMoney } from "@/lib/mock/orders";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CustomerHistoryProps {
  activity?: CustomerActivity[];
  customerName?: string;
  onOpenOrder?: (orderId: string) => void;
}

const formatDate = (isoString: string) => {
  try {
    const formatted = new Intl.DateTimeFormat("es-PE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(isoString));
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  } catch {
    return isoString;
  }
};

const formatTime = (isoString: string) => {
  try {
    return new Intl.DateTimeFormat("es-PE", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(isoString));
  } catch {
    return "";
  }
};

export function CustomerHistory({
  activity = [],
  customerName = "Amanda Harvey",
  onOpenOrder,
}: CustomerHistoryProps) {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [transcriptionOpen, setTranscriptionOpen] = useState(false);

  const getActivityIcon = (type: CustomerActivity["type"]) => {
    switch (type) {
      case "actualizacion":
        return <SlidersHorizontal className="size-4" />;
      case "llamada":
        return <PhoneCall className="size-4" />;
      case "pedido":
        return <FileText className="size-4" />;
      case "creacion":
        return <UserCheck className="size-4" />;
      case "nota":
      default:
        return <Sparkles className="size-4" />;
    }
  };

  const renderChangeIcon = (icon?: string) => {
    switch (icon) {
      case "clock":
        return <Clock className="size-4 shrink-0 text-muted-foreground" />;
      case "calendar":
        return <Calendar className="size-4 shrink-0 text-muted-foreground" />;
      case "dollar":
        return <DollarSign className="size-4 shrink-0 text-muted-foreground" />;
      case "check":
      default:
        return (
          <CheckCircle2 className="size-4 shrink-0 text-muted-foreground" />
        );
    }
  };

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card font-heading">
      <h2 className="border-b border-border px-5 py-3 text-sm font-medium text-foreground">
        Última actividad
      </h2>

      {activity.length > 0 ? (
        <div className="flex flex-col p-5">
          {activity.map((item, index) => {
            const isLast = index === activity.length - 1;

            return (
              <div key={item.id} className="flex items-start gap-3">
                {/* Columna Izquierda: Eje del timeline con nodo y badge */}
                <div className="flex w-8 shrink-0 flex-col items-center self-stretch">
                  {/* Nodo circular pequeño alineado con la fecha */}
                  <span className="flex size-2 max-h-2 max-w-2 min-h-2 min-w-2 shrink-0 items-center justify-center rounded-full border border-border bg-muted/80 mt-0.5" />

                  {/* Línea vertical corta que conecta el nodo pequeño con el badge */}
                  <span className="h-2 w-px shrink-0 bg-border/80" />

                  {/* Badge circular grande con icono */}
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border/80 bg-muted/40 text-muted-foreground shadow-2xs">
                    {getActivityIcon(item.type)}
                  </span>

                  {/* Línea vertical conectora hacia el siguiente evento */}
                  {!isLast && (
                    <span className="my-1 min-h-12 w-px flex-1 bg-border/80" />
                  )}
                </div>

                {/* Columna Derecha: Todo el contenido del evento */}
                <div className={cn("min-w-0 flex-1", !isLast && "pb-8")}>
                  {/* Fecha en la parte superior en español */}
                  <p className="text-xs font-medium leading-none text-muted-foreground">
                    {formatDate(item.createdAt)}
                  </p>

                  {/* Bloque principal alineado con el badge */}
                  <div className="mt-2.5 min-w-0">
                    {/* 1. Encabezado para actualización */}
                    {item.type === "actualizacion" && (
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          {customerName}
                        </span>{" "}
                        {item.title}{" "}
                        {item.storeName && (
                          <span className="inline-flex items-center gap-1 rounded-md border border-border/80 bg-muted px-2 py-1.5 leading-none text-xs font-medium text-foreground">
                            <Zap className="size-3" />
                            {item.storeName}
                          </span>
                        )}
                        <span className="ml-2 text-xs text-muted-foreground">
                          • {formatTime(item.createdAt)}
                        </span>
                      </p>
                    )}

                    {/* 2. Encabezado para llamada */}
                    {item.type === "llamada" && (
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          Llamada entrante
                        </span>{" "}
                        de{" "}
                        <span className="font-semibold text-foreground">
                          {customerName}
                        </span>{" "}
                        <span className="font-normal text-muted-foreground">
                          {item.callDuration || "1m:25s"} •{" "}
                          {formatTime(item.createdAt)}
                        </span>
                      </p>
                    )}

                    {/* 3. Encabezado para pedido */}
                    {item.type === "pedido" && (
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          {customerName}
                        </span>{" "}
                        registró un pedido por{" "}
                        <span className="font-semibold text-foreground">
                          {item.orderSummary
                            ? formatOrderMoney(item.orderSummary.amount)
                            : "S/ 314.90"}
                        </span>
                      </p>
                    )}

                    {/* 4. Encabezado por defecto */}
                    {item.type !== "actualizacion" &&
                      item.type !== "llamada" &&
                      item.type !== "pedido" && (
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          <span className="font-semibold text-foreground">
                            {customerName}
                          </span>{" "}
                          {item.title}{" "}
                          <span className="ml-2 text-xs text-muted-foreground">
                            • {formatTime(item.createdAt)}
                          </span>
                        </p>
                      )}

                    {/* Contenido especializado según tipo de actividad */}

                    {/* Lista de cambios de atributos */}
                    {item.type === "actualizacion" && item.changes && (
                      <div className="mt-3.5 space-y-2 text-sm text-foreground/80">
                        {item.changes.map((ch, i) => (
                          <div key={i} className="flex items-center gap-2">
                            {renderChangeIcon(ch.icon)}
                            <span className="text-muted-foreground">
                              {ch.label}
                            </span>
                            <ArrowRight className="size-4 text-muted-foreground/60" />
                            <span className="font-medium text-foreground">
                              {ch.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reproductor de nota de voz */}
                    {item.type === "llamada" && (
                      <div className="mt-3.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-2.5 py-2">
                            <button
                              type="button"
                              onClick={() => setIsAudioPlaying((prev) => !prev)}
                              className="flex size-7 cursor-pointer items-center justify-center rounded-full bg-foreground text-background transition-transform"
                              aria-label="Reproducir audio de llamada"
                            >
                              {isAudioPlaying ? (
                                <Pause className="size-3.5 fill-current" />
                              ) : (
                                <Play className="ml-0.5 size-3.5 fill-current" />
                              )}
                            </button>

                            <div className="flex h-5 items-center gap-0.75 px-1">
                              {[
                                4, 8, 14, 10, 16, 12, 18, 14, 8, 12, 6, 10, 5,
                              ].map((h, idx) => (
                                <span
                                  key={idx}
                                  style={{ height: `${h}px` }}
                                  className={cn(
                                    "w-0.75 rounded-full transition-all",
                                    isAudioPlaying
                                      ? "animate-pulse bg-primary"
                                      : "bg-muted-foreground/65",
                                  )}
                                />
                              ))}
                            </div>

                            <span className="font-mono text-xs text-muted-foreground">
                              01:25
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              setTranscriptionOpen((prev) => !prev)
                            }
                            className="font-sans inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.75 text-sm font-medium text-foreground shadow-2xs transition-colors hover:bg-muted/40"
                          >
                            <FileText className="size-4 text-muted-foreground" />
                            <span>Convertir voz a texto</span>
                          </button>
                        </div>

                        {transcriptionOpen && (
                          <div className="mt-3 rounded-xl border border-border/80 bg-muted/20 p-3.5 text-sm leading-relaxed text-foreground animate-in fade-in-50 duration-200">
                            <p className="mb-1 flex items-center gap-2 font-semibold text-foreground">
                              <span className="inline-block size-2 rounded-full bg-emerald-500" />
                              Transcripción de audio:
                            </p>
                            <p className="text-muted-foreground">
                              &ldquo;Hola, buenas tardes. Habla Amanda Harvey,
                              quería consultar si tienen disponibilidad de los
                              polos de algodón y confirmar la entrega para esta
                              tarde por favor.&rdquo;
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tarjeta de pago / pedido con StatusBadge oficial */}
                    {item.type === "pedido" && (
                      <div className="mt-3.5 overflow-hidden rounded-xl border border-border bg-card">
                        <div className="grid grid-cols-2 gap-2 border-b border-border/60 px-4 py-3 text-xs font-semibold uppercase sm:grid-cols-4">
                          <span>Fecha</span>
                          <span>Método de pago</span>
                          <span>Estado</span>
                          <span className="text-right sm:text-left">
                            Importe
                          </span>
                        </div>

                        <div className="px-4 py-3 grid grid-cols-2 items-center gap-3 text-sm sm:grid-cols-4">
                          {/* Fecha con badge PDF */}
                          <div className="flex items-center gap-2">
                            <div className="inline-flex items-center gap-1 text-nowrap rounded-lg leading-none px-2.5 py-2 text-[13px] font-medium font-heading bg-rose-600/20 dark:bg-rose-600/10 text-rose-600 dark:text-rose-400">
                              <FileText className="size-3.5" />
                              PDF
                            </div>
                            <span className="font-medium text-foreground">
                              {item.orderSummary?.date || "08 Sep, 2026"}
                            </span>
                          </div>

                          {/* Método de pago */}
                          <div className="flex items-center gap-2 text-foreground">
                            <Landmark className="size-4 shrink-0 text-muted-foreground" />
                            <span className="font-mono text-sm font-medium">
                              {item.orderSummary?.methodNumber || "**** 7887"}
                            </span>
                          </div>

                          {/* Estado con StatusBadge de components/app/shared */}
                          <div>
                            <StatusBadge
                              status={
                                item.orderSummary?.status === "completed"
                                  ? "pagado"
                                  : "pago_pendiente"
                              }
                              label={
                                item.orderSummary?.status === "completed"
                                  ? "Pagado"
                                  : "Pendiente"
                              }
                            />
                          </div>

                          {/* Importe y botón Ver detalle */}
                          <div className="col-span-2 flex items-center justify-between gap-3 sm:col-span-1 sm:justify-between">
                            <span className="font-semibold tabular-nums text-foreground">
                              {item.orderSummary
                                ? formatOrderMoney(item.orderSummary.amount)
                                : "S/ 314.90"}
                            </span>
                            <Button
                              type="button"
                              variant="link"
                              onClick={() =>
                                onOpenOrder?.(
                                  item.orderSummary?.orderId || "ord_1054",
                                )
                              }
                              className="h-fit cursor-pointer p-0 underline"
                            >
                              Ver detalle
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Descripción estándar si existe */}
                    {item.type !== "actualizacion" &&
                      item.type !== "llamada" &&
                      item.type !== "pedido" &&
                      item.description && (
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Calendar className="size-5" />
          </div>
          <p className="mt-2.5 text-sm font-medium text-foreground">
            Sin actividad registrada
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Las acciones sobre este cliente se registrarán aquí.
          </p>
        </div>
      )}
    </section>
  );
}
