"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  BriefcaseBusiness,
  ChartNoAxesCombined,
  ChartPie,
  MessagesSquare,
  ShoppingBag,
  Wallet,
} from "lucide-react";

const demoTabs = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: ChartNoAxesCombined,
    image: "/images/demo/dashboard.png",
    alt: "Vista previa del Account Hub de Zentro",
  },
  {
    id: "workspace",
    label: "Workspace",
    icon: BriefcaseBusiness,
    image: "/images/demo/workspace.png",
    alt: "Vista previa del Tenant Dashboard de Zentro",
  },
  {
    id: "pos",
    label: "POS",
    icon: Wallet,
    image: "/images/demo/pos.png",
    alt: "Vista previa del POS (Punto de Venta) de Zentro",
  },
  {
    id: "inventario",
    label: "Inventario",
    icon: ChartPie,
    image: "/images/demo/inventario.png",
    alt: "Vista previa del Inventario de Zentro",
  },
  {
    id: "catalogo",
    label: "Catálogo",
    icon: ShoppingBag,
    image: "/images/demo/catalogo.png",
    alt: "Vista previa del Catálogo de productos de Zentro",
  },
  {
    id: "crm",
    label: "CRM",
    icon: MessagesSquare,
    image: "/images/demo/crm.png",
    alt: "Vista previa del CRM y clientes de Zentro",
  },
];

export function Demo() {
  const [activeTab, setActiveTab] = useState(demoTabs[0].id);

  const currentTab =
    demoTabs.find((tab) => tab.id === activeTab) || demoTabs[0];

  return (
    <section className="flex flex-col gap-y-5">
      {/* Buttons con estilo ghost por defecto y glass al estar activo */}
      <div className="flex items-center gap-x-1.5 overflow-x-auto scrollbar-hide p-1 border border-border rounded-full bg-accent w-full max-w-fit">
        {demoTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <Button
              key={tab.id}
              variant={isActive ? "glass" : "ghost"}
              onClick={() => setActiveTab(tab.id)}
              className="cursor-pointer px-3.5 rounded-full py-2 h-fit text-sm transition-all select-none"
            >
              <Icon className="size-4" />
              <p>{tab.label}</p>
            </Button>
          );
        })}
      </div>

      {/* Preview interactivo */}
      <div className="glass rounded-xl w-full p-2 md:p-4 flex flex-col shadow-xl">
        <div className="flex items-center gap-x-2 px-2 sm:px-3">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>

        <div className="w-full h-full flex items-center justify-center rounded-lg mt-2 sm:mt-3 bg-white overflow-hidden">
          <img
            key={currentTab.id}
            src={currentTab.image}
            alt={currentTab.alt}
            className="w-full min-h-100 object-cover transition-opacity duration-300"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
