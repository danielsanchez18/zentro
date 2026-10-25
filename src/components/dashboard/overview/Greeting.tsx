"use client";

import { useAuthStore } from "@/stores/auth-store";
import { greetingFor } from "@/lib/format/dates";

export const Greeting = () => {
  // Nombre completo (nombre y apellido) del usuario de la sesión.
  const fullName = useAuthStore((state) => state.user?.name ?? "");

  return (
    <div data-demo="greeting" className="bg-card rounded-sm px-4 py-4">
      <h1 className="font-medium font-sans text-lg">
        {greetingFor()}, {fullName}
      </h1>
      <p className="text-sm text-muted-foreground">
        Este es el resumen de tus organizaciones, invitaciones y suscripciones.
      </p>
    </div>
  );
};
