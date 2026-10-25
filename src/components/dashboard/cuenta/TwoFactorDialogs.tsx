"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Download, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { errorMessage } from "@/components/dashboard/cuenta/ui";
import {
  disableTwoFactor,
  enableTwoFactor,
  regenerateRecoveryCodes,
  setupTwoFactor,
  type TwoFactorSetup,
} from "@/lib/services/account.service";

const footerButton = "px-3 text-sm rounded-full";

interface BaseProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Se llama al terminar para recargar el estado de 2FA. */
  onDone: () => void;
}

const OtpField = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
  <div className="flex justify-center py-1">
    <InputOTP maxLength={6} value={value} onChange={onChange} autoFocus aria-label="Código de la app">
      <InputOTPGroup className="gap-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <InputOTPSlot key={index} index={index} className="w-11 h-11 text-lg rounded-md border" />
        ))}
      </InputOTPGroup>
    </InputOTP>
  </div>
);

const ErrorText = ({ error }: { error: string }) =>
  error ? <p className="rounded-lg bg-destructive/10 px-4 py-2 sm:mx-1 text-sm text-destructive">{error}</p> : null;

/** Lista de códigos de respaldo con copiar y descargar (se muestran una sola vez). */
const RecoveryCodesList = ({ codes }: { codes: string[] }) => {
  const [copied, setCopied] = useState(false);
  const text = codes.join("\n");

  const download = () => {
    const blob = new Blob([`Códigos de respaldo de Zentro\nCada código sirve una sola vez.\n\n${text}\n`], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "zentro-codigos-de-respaldo.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3 sm:px-1">
      <ul className="grid grid-cols-2 gap-2 rounded-lg bg-muted/60 p-3 font-mono text-sm">
        {codes.map((code) => (
          <li key={code} className="text-center tracking-wider">
            {code}
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className={`${footerButton} flex-1`}
          onClick={() => {
            void navigator.clipboard.writeText(text).then(() => setCopied(true));
          }}
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? "Copiados" : "Copiar"}
        </Button>
        <Button type="button" variant="outline" className={`${footerButton} flex-1`} onClick={download}>
          <Download className="size-4" />
          Descargar
        </Button>
      </div>
    </div>
  );
};

/* ------------------------------ Activar ------------------------------ */

type SetupStep = "scan" | "codes";

/** Activar: escanear QR → confirmar código → guardar códigos de respaldo. */
export const EnableTwoFactorDialog = ({ open, onOpenChange, onDone }: BaseProps) => {
  const [step, setStep] = useState<SetupStep>("scan");
  const [setup, setSetup] = useState<TwoFactorSetup | null>(null);
  const [code, setCode] = useState("");
  const [codes, setCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Cada vez que se abre se genera un secreto pendiente nuevo.
  useEffect(() => {
    if (!open) return;
    setupTwoFactor()
      .then(setSetup)
      .catch((err) => setError(errorMessage(err, "No pudimos generar el código QR.")));
  }, [open]);

  const close = () => {
    if (step === "codes") onDone();
    onOpenChange(false);
    setStep("scan");
    setSetup(null);
    setCode("");
    setCodes([]);
    setError("");
  };

  const confirm = async () => {
    if (code.length !== 6 || loading) return;
    setLoading(true);
    setError("");
    try {
      const result = await enableTwoFactor(code);
      setCodes(result.recoveryCodes);
      setStep("codes");
    } catch (err) {
      setError(errorMessage(err, "El código no es correcto."));
      setCode("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : close())}>
      <DialogContent showCloseButton={step !== "codes"}>
        <DialogHeader className="sm:px-1 gap-y-0">
          <DialogTitle className="font-sans text-lg font-medium">
            {step === "scan" ? "Activar verificación en dos pasos" : "Guarda tus códigos de respaldo"}
          </DialogTitle>
          <DialogDescription>
            {step === "scan"
              ? "Escanea el código con Google Authenticator, Authy o 1Password y escribe el código de 6 dígitos que aparece."
              : "Úsalos si pierdes tu celular. Cada uno sirve una sola vez y no los volveremos a mostrar."}
          </DialogDescription>
        </DialogHeader>

        {step === "scan" && (
          <div className="space-y-4 sm:px-1">
            <div className="flex flex-col items-center gap-3">
              {setup ? (
                // eslint-disable-next-line @next/next/no-img-element -- QR en data URL generado por la API
                <img src={setup.qrCode} alt="Código QR para la app autenticadora" className="size-44 rounded-lg bg-white p-2" />
              ) : (
                <div className="flex size-44 items-center justify-center rounded-lg bg-muted">
                  <Loader2 className="size-5 animate-spin text-muted-foreground" />
                </div>
              )}
              {setup && (
                <p className="text-center text-xs text-muted-foreground">
                  ¿No puedes escanear? Ingresa esta clave:
                  <span className="mt-1 block select-all break-all font-mono text-sm text-foreground">{setup.secret}</span>
                </p>
              )}
            </div>
            <OtpField
              value={code}
              onChange={(value) => {
                setCode(value);
                setError("");
              }}
            />
          </div>
        )}

        {step === "codes" && <RecoveryCodesList codes={codes} />}

        <ErrorText error={error} />

        <DialogFooter className="mt-2">
          {step === "scan" ? (
            <>
              <Button variant="outline" onClick={close} className={footerButton}>
                Cancelar
              </Button>
              <Button onClick={() => void confirm()} disabled={!setup || code.length !== 6 || loading} className={footerButton}>
                {loading && <Loader2 className="size-4 animate-spin" />}
                Activar
              </Button>
            </>
          ) : (
            <Button onClick={close} className={footerButton}>
              Ya los guardé
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/* ----------------------------- Desactivar ----------------------------- */

export const DisableTwoFactorDialog = ({
  open,
  onOpenChange,
  onDone,
  hasPassword,
}: BaseProps & { hasPassword: boolean }) => {
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setPassword("");
      setCode("");
      setError("");
    }
    onOpenChange(next);
  };

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      await disableTwoFactor({ code: code.trim(), password: hasPassword ? password : undefined });
      onDone();
      handleOpenChange(false);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader className="sm:px-1 gap-y-0">
          <DialogTitle className="font-sans text-lg font-medium">Desactivar verificación en dos pasos</DialogTitle>
          <DialogDescription>Tu cuenta quedará protegida solo con tu {hasPassword ? "contraseña" : "cuenta de Google"}.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-1 sm:px-1">
          {hasPassword && (
            <div className="flex flex-col gap-y-2">
              <label htmlFor="tfa-password" className="text-sm font-medium">
                Contraseña
              </label>
              <Input
                id="tfa-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                autoFocus
                className="text-sm px-4 py-2 h-fit"
              />
            </div>
          )}
          <div className="flex flex-col gap-y-2">
            <label htmlFor="tfa-code" className="text-sm font-medium">
              Código de la app o de respaldo
            </label>
            <Input
              id="tfa-code"
              value={code}
              onChange={(event) => setCode(event.target.value.toUpperCase())}
              placeholder="123456"
              maxLength={9}
              autoFocus={!hasPassword}
              className="text-sm px-4 py-2 h-fit font-mono tracking-widest"
            />
          </div>
        </div>
        <ErrorText error={error} />
        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={() => handleOpenChange(false)} className={footerButton}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={() => void submit()}
            disabled={loading || code.trim().length < 6 || (hasPassword && !password)}
            className={footerButton}
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            Desactivar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/* ------------------------ Códigos de respaldo ------------------------ */

export const RecoveryCodesDialog = ({ open, onOpenChange, onDone }: BaseProps) => {
  const [code, setCode] = useState("");
  const [codes, setCodes] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      if (codes) onDone();
      setCode("");
      setCodes(null);
      setError("");
    }
    onOpenChange(next);
  };

  const submit = async () => {
    if (code.length !== 6 || loading) return;
    setLoading(true);
    setError("");
    try {
      const result = await regenerateRecoveryCodes(code);
      setCodes(result.recoveryCodes);
    } catch (err) {
      setError(errorMessage(err, "El código no es correcto."));
      setCode("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={!codes}>
        <DialogHeader className="sm:px-1 gap-y-0">
          <DialogTitle className="font-sans text-lg font-medium">
            {codes ? "Tus nuevos códigos de respaldo" : "Generar códigos de respaldo nuevos"}
          </DialogTitle>
          <DialogDescription>
            {codes
              ? "Los códigos anteriores ya no sirven. Guárdalos en un lugar seguro."
              : "Los códigos anteriores dejarán de funcionar. Confirma con el código de tu app."}
          </DialogDescription>
        </DialogHeader>
        {codes ? (
          <RecoveryCodesList codes={codes} />
        ) : (
          <OtpField
            value={code}
            onChange={(value) => {
              setCode(value);
              setError("");
            }}
          />
        )}
        <ErrorText error={error} />
        <DialogFooter className="mt-2">
          {codes ? (
            <Button onClick={() => handleOpenChange(false)} className={footerButton}>
              Ya los guardé
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => handleOpenChange(false)} className={footerButton}>
                Cancelar
              </Button>
              <Button onClick={() => void submit()} disabled={code.length !== 6 || loading} className={footerButton}>
                {loading && <Loader2 className="size-4 animate-spin" />}
                Generar
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
