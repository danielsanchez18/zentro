"use client";

import { useRouter } from "next/navigation";
import { usePurchasesStore } from "@/stores/purchases-store";
import { PurchasesHeader } from "./PurchasesHeader";
import { PurchasesKpis } from "./PurchasesKpis";
import { PurchasesList } from "./PurchasesList";

export function PurchasesModule({ slug }: { slug: string }) {
  const router = useRouter();
  const orders = usePurchasesStore((state) => state.orders);
  return (
    <div className="w-full space-y-7 px-5 py-7 md:px-7 xl:px-10">
      <PurchasesHeader onCreate={() => router.push(`/app/${slug}/compras/agregar`)} />
      <PurchasesKpis orders={orders} />
      <PurchasesList slug={slug} orders={orders} />
    </div>
  );
}
