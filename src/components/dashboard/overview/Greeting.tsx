"use client";

import { useDashboardStore } from "@/stores/dashboard-store";
import { greetingFor } from "@/lib/format/dates";

export const Greeting = () => {
  const user = useDashboardStore((state) => state.currentUser);
  const firstName = user.name.split(" ")[0];

  return (
    <div data-demo="greeting" className="bg-card rounded-sm px-4 py-4">
      <h1 className="font-medium font-sans text-lg">
        {greetingFor()}, {firstName}
      </h1>
      <p className="text-sm text-muted-foreground">
        Este es el resumen de tus organizaciones, invitaciones y suscripciones.
      </p>
    </div>
  );
};
