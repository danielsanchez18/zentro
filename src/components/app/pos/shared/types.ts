export type PosServiceType = "mesa" | "recojo" | "delivery";
export type PosPaymentMethod = "efectivo" | "tarjeta" | "yape" | "plin" | "transferencia";

export interface PosCartLine {
  id: string;
  productId: string;
  name: string;
  variantId?: string;
  variantLabel?: string;
  unitPrice: number;
  quantity: number;
  stock: number;
  note: string;
}

export interface SuspendedSale {
  id: string;
  name: string;
  lines: PosCartLine[];
  createdAt: string;
}

