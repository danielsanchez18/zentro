import { Button } from "@/components/ui/button";
import { Toast } from "@/components/app/shared/Toast";
import type { OrderStatus } from "@/lib/mock/orders";

const labels: Partial<Record<OrderStatus, string>> = { nuevo: "Confirmar pedido", confirmado: "Iniciar preparación", en_preparacion: "Marcar como listo", listo: "Completar entrega" };
export function OrderDetailActions({ status, onNext, onCancel }: { status: OrderStatus; onNext: () => void; onCancel: () => void }) { const next = labels[status]; if (!next) return null; return <Toast ariaLabel="Acciones del pedido">{["nuevo", "confirmado", "en_preparacion", "listo"].includes(status) && <Button type="button" variant="link" onClick={onCancel} className="cursor-pointer px-3 text-rose-400">Cancelar</Button>}<Button type="button" variant="link" onClick={onNext} className="cursor-pointer px-3 text-green-400">{next}</Button></Toast>; }
