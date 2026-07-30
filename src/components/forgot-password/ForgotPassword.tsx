"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export function ForgotPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";
  const [code, setCode] = useState("");

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate confirming code
    console.log("Confirming code", code, "for email", email);
    router.push(`/reset-password?email=${encodeURIComponent(email)}`);
  };

  const handleResend = () => {
    // Simulate resending code
    console.log("Resending code to", email);
  };

  return (
    <div className="flex flex-col items-center gap-y-10 w-full max-w-sm">
      <form onSubmit={handleConfirm} className="w-full space-y-5 px-5">
        <div className="space-y-2 text-center mb-8">
          <p className="text-base text-muted-foreground">
            Ingresa el código de seguridad que enviamos a <br />
            <span className="font-semibold text-foreground">{email}</span>
          </p>
        </div>

        {/* Input Code */}
        <div className="flex items-center justify-center gap-x-3 w-full">
          <InputOTP maxLength={6} value={code} onChange={setCode} autoFocus>
            <InputOTPGroup className="gap-2">
              <InputOTPSlot index={0} className="w-12 h-12 text-lg rounded-md border" />
              <InputOTPSlot index={1} className="w-12 h-12 text-lg rounded-md border" />
              <InputOTPSlot index={2} className="w-12 h-12 text-lg rounded-md border" />
              <InputOTPSlot index={3} className="w-12 h-12 text-lg rounded-md border" />
              <InputOTPSlot index={4} className="w-12 h-12 text-lg rounded-md border" />
              <InputOTPSlot index={5} className="w-12 h-12 text-lg rounded-md border" />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button type="button" variant="outline" onClick={handleResend} className="w-full py-2 rounded-full h-fit text-base">
            Reenviar código
          </Button>
          <Button type="submit" className="w-full py-2 rounded-full h-fit text-base">
            Confirmar
          </Button>
        </div>
      </form>
    </div>
  );
}
