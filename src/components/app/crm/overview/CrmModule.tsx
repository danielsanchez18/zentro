"use client";
import { useRouter } from "next/navigation";
import { useCrmStore } from "@/stores/crm-store";
import { CustomersHeader } from "./CustomersHeader";
import { CustomersKpis } from "./CustomersKpis";
import { CustomersList } from "./CustomersList";

export function CrmModule({ slug }: { slug: string }) {
  const router = useRouter();
  const customers = useCrmStore((state) => state.customers);
  return (
    <div className="w-full space-y-7 px-5 py-7 md:px-7 xl:px-10">
      <CustomersHeader
        onAdd={() => router.push(`/app/${slug}/clientes/agregar`)}
      />
      <CustomersKpis customers={customers} />
      <CustomersList slug={slug} customers={customers} />
    </div>
  );
}
