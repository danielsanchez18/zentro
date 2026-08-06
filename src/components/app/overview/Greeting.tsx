"use client";

import { useAuthStore } from "@/stores/auth-store";

export const Greeting = () => {

    const user = useAuthStore((s) => s.user);

    const fullName = user?.name?.trim() ?? "Daniel";
    const words = fullName.split(/\s+/).filter(Boolean);
    // Primer nombre + primer apellido (primeros dos tokens; si el nombre es
    // solo uno, mostramos el único token).
    const greetingName = words.slice(0, 2).join(" ") || fullName;
    
    return (
        <div className="space-y-1">
            <h1 className="text-lg font-sans font-medium">
            Buen día, {greetingName} 
        </h1>
        <p className="text-sm text-muted-foreground">
            Esto es lo que está pasando con tu empresa hoy.
        </p>
    </div>
  )
}
