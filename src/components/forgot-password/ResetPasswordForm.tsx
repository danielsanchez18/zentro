"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aquí podrías agregar validaciones extra (ej. longitud mínima)
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden. Por favor, verifica.");
      return;
    }
    
    // Simulate updating password
    console.log("Password updated successfully for", email);
    
    // Redirigir al usuario de vuelta al login
    if (email) {
      router.push(`/ingresar?email=${encodeURIComponent(email)}`);
    } else {
      router.push("/ingresar");
    }
  };

  return (
    <div className="flex flex-col items-center gap-y-10 w-full max-w-sm">
      <form onSubmit={handleSubmit} className="w-full space-y-5 px-5">
        
        <div className="relative">
          <Input 
            type="password" 
            id="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nueva contraseña" 
            required
            autoFocus
            className="text-base pl-13 pr-5 rounded-full h-fit py-2.5"
          />
          <Lock className="absolute left-5.5 top-1/2 -translate-y-1/2 size-4.5 text-muted-foreground pointer-events-none" />
        </div>

        <div className="relative">
          <Input 
            type="password" 
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmar contraseña" 
            required
            className="text-base pl-13 pr-5 rounded-full h-fit py-2.5"
          />
          <Lock className="absolute left-5.5 top-1/2 -translate-y-1/2 size-4.5 text-muted-foreground pointer-events-none" />
        </div>

        <Button type="submit" className="w-full py-2 rounded-full h-fit text-base mt-2">
          Actualizar contraseña
        </Button>
        
      </form>
    </div>
  );
}
