import Link from "next/link";
import type { CustomerOrder } from "@/lib/mock/orders";

export function OrderDetailHeader({ order, slug }: { order: CustomerOrder; slug: string }) { return <header><Link href={`/app/${slug}/pedidos`} className="text-sm font-medium text-primary hover:underline">Regresar</Link><h1 className="mt-1 text-xl font-medium tracking-tight">Detalle del pedido</h1><p className="mt-1 text-sm text-muted-foreground">{order.number} · {order.customerName}</p></header>; }
