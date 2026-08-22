"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TitleProps {
  slug: string;
}

/** Encabezado del módulo Catálogo con botón «+ Producto». */
export const Title = ({ slug }: TitleProps) => (
  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 className="font-heading text-lg font-medium tracking-tight">
        Catálogo de productos
      </h1>
      <p className="text-sm text-muted-foreground">
        Gestiona los productos, categorías y precios de la organización.
      </p>
    </div>
    <Button
      render={<Link href={`/app/${slug}/catalogo/agregar`} />}
      nativeButton={false}
      className="text-sm rounded-full px-3 gap-x-1"
    >
      <p>Crear producto</p>
    </Button>
  </div>
);