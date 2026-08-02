"use client";

import { useState } from "react";
import { BadgeAlert, BadgeCheck, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// TODO(0.2): leer desde GET /users/me y PATCH /users/me
const PROFILE = {
  name: "Juan Pérez",
  email: "admin@lasrocas.com",
  emailVerified: true,
};

export const PerfilSection = () => {
  const [name, setName] = useState(PROFILE.name);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 600);
  };

  return (
    <div className="flex flex-col w-full lg:pl-5">

      {/* Foto */}
      <div className="py-3 lg:pt-0 lg:pb-5 border-b border-border flex items-center gap-x-3">
        <div className="size-15 bg-accent rounded-full flex items-center justify-center">
          <svg className="size-6" 
              xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none" />
              <g fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="6" r="4" />
                  <path d="M20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5Z" />
              </g>
          </svg>
        </div>
        <Button variant="outline" className="px-3 text-[13px] rounded-full">
          <Upload className="size-3.5" />
          Subir foto
        </Button>
      </div>

      {/* Nombres completos */}
      <div className="py-4 border-b border-border space-y-2 flex flex-wrap gap-5">

        <div className="space-y-1">
          <p className="text-sm font-medium">Nombres Completos</p>
          <p className="text-muted-foreground text-sm">Daniel Sánchez</p>
        </div>

      </div>

      {/* Correo electrónico */}
      <div className="py-4 border-b border-border space-y-2 flex flex-wrap items-center justify-between gap-x-5">

        <div className="space-y-1">
          <p className="text-sm font-medium">Correo electrónico</p>
          
          <div className="flex items-center gap-x-3 flex-wrap">
            <p className="text-muted-foreground text-sm">dsanchez151r@gmail.com</p>
            {/* <div className="h-fit flex items-center gap-x-1 text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 text-xs rounded-full px-2 py-1 uppercase font-medium border border-emerald-700 w-fit">
              <BadgeCheck className="size-4" />
              <span>Verificado</span>
            </div> */}
            <div className="h-fit flex items-center gap-x-1 text-yellow-700 dark:text-yellow-400 bg-yellow-500/10 text-xs rounded-full px-2 py-1 uppercase font-medium border border-yellow-700 w-fit">
              <BadgeAlert className="size-4" />
              <span>Sin verificar</span>
            </div>
          </div>
        </div>

        <Button size="sm" variant="outline" className="text-sm rounded-full h-fit px-3 py-1.5">Verificar</Button>
      </div>

      {/* Teléfono */}
      <div className="pt-5 space-y-2 flex flex-wrap items-center justify-between gap-x-5 w-full">

        <div className="space-y-1">
          <p className="text-sm font-medium">Teléfono</p>
          {/* <p className="text-muted-foreground text-sm">+52 999 1234 567</p> */}
          <Input className="mt-3 h-fit px-4 py-2 w-full text-sm" placeholder="Teléfono" value="936245721" />
          
          <div className="mt-2 flex items-center gap-x-1">
            <Button size="sm" variant="outline" className="text-sm rounded-full h-fit px-4 py-1.5">Cancelar</Button>
            <Button size="sm" className="text-sm rounded-full h-fit px-4 py-1.5">Guardar</Button>
          </div>
        </div>
        
        {/* <Button size="sm" variant="outline" className="text-sm rounded-full h-fit px-3 py-1.5">Editar</Button> */}
      </div>

    </div>
  );
};
