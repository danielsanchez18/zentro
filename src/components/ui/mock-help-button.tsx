'use client';

import { useAppStore } from '@/stores/app-store';
import { useEffect, useRef, useState } from 'react';
import { HelpCircle, KeyRound, UserRound, X } from 'lucide-react';
import { MOCK_CREDENTIALS, MOCK_TEST_EMAILS, MOCK_USER, MOCK_TIPS } from '@/lib/mock/data';

/**
 * Botón flotante (abajo-derecha) con icono "?".
 * Solo visible cuando el modo MOCK está activo.
 * Muestra los datos de prueba disponibles para probar la app.
 *
 * Cuando se quite el modo mock (ver docs/mock-mode.md),
 * este componente se puede eliminar sin tocar nada más.
 */
export function MockHelpButton() {
  const mockMode = useAppStore((s) => s.mockMode);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!mockMode) return null;

  return (
    <div ref={ref} className="fixed bottom-5 right-5 z-[60]">
      {open ? (
        <div className="absolute bottom-full right-0 mb-3 w-[20rem] max-w-[calc(100vw-2.5rem)] bg-popover border border-border rounded-lg shadow-lg p-4 text-sm">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <p className="font-semibold text-popover-foreground leading-tight">
                Datos de prueba
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Estás en modo Mock — sin backend.
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label="Cerrar"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="space-y-2.5">
            <div className="rounded-lg border border-border p-3">
              <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
                <KeyRound className="size-3.5" />
                Credenciales de login
              </p>
              <p className="text-popover-foreground font-mono text-xs break-all">
                {MOCK_CREDENTIALS.email}
              </p>
              <p className="text-popover-foreground font-mono text-xs">
                {MOCK_CREDENTIALS.password}
              </p>
            </div>

            <div className="rounded-lg border border-border p-3">
              <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
                <UserRound className="size-3.5" />
                Usuario mock
              </p>
              <p className="text-popover-foreground text-xs">
                {MOCK_USER.name} — {MOCK_USER.organization}
              </p>
              <p className="text-muted-foreground text-xs">{MOCK_USER.branch}</p>
            </div>

            <div className="rounded-lg border border-border p-3">
              <p className="text-xs font-medium text-muted-foreground mb-1.5">Tips</p>
              <ul className="space-y-1">
                {MOCK_TIPS.map((tip) => (
                  <li key={tip} className="text-xs text-popover-foreground leading-snug list-disc list-inside">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-[11px] text-muted-foreground leading-snug">
              Detalle completo en <code className="font-mono">docs/mock-mode.md</code>
            </p>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center justify-center size-11 rounded-full bg-popover border border-border shadow-lg hover:bg-muted hover:scale-105 transition-all cursor-pointer"
          aria-label="Ver datos de prueba disponibles"
          title="Ver datos de prueba (modo Mock)"
        >
          <HelpCircle className="size-5 text-muted-foreground" />
        </button>
      )}
    </div>
  );
}
