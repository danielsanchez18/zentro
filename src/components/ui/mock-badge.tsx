'use client';

import { useAppStore } from '@/stores/app-store';
import { useAuthStore } from '@/stores/auth-store';
import { checkHealth } from '@/lib/api/health-check';
import { isMockForced } from '@/lib/api/api-config';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function MockBadge() {
  const { mockMode, apiStatus, setMockMode, setApiStatus, forcedMode, forceMode } = useAppStore();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingMode, setPendingMode] = useState<'mock' | 'api'>('mock');
  const ref = useRef<HTMLDivElement>(null);

  // Auto-detección solo si el usuario NO forzó un modo
  useEffect(() => {
    if (forcedMode !== null) return;

    const check = async () => {
      const status = await checkHealth();
      setApiStatus(status);
      if (isMockForced()) {
        setMockMode(true);
      } else if (status === 'api') {
        setMockMode(false);
      }
    };
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, [forcedMode, setApiStatus, setMockMode]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const switchMode = () => {
    const next: 'mock' | 'api' = mockMode ? 'api' : 'mock';

    // Si hay sesión activa, avisamos que cambiará de modo y saldrá al login
    if (isAuthenticated) {
      setPendingMode(next);
      setOpen(false);
      setConfirmOpen(true);
      return;
    }

    forceMode(next);
    setOpen(false);
  };

  const confirmSwitch = () => {
    forceMode(pendingMode);
    logout();
    setConfirmOpen(false);
    setOpen(false);
    router.push('/ingresar');
  };

  const icon = apiStatus === 'api' ? '🟢' : apiStatus === 'error' ? '🔴' : '🟡';
  const label = apiStatus === 'api' ? 'API' : apiStatus === 'error' ? 'Error' : 'Mock';
  const nextLabel = mockMode ? 'API' : 'Mock';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full border border-border hover:bg-muted transition-colors"
        title={`Modo: ${label}`}
      >
        <span>{icon}</span>
        <span>{label}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-popover border border-border rounded-lg shadow-lg p-3 z-50 text-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">{icon}</span>
            <span className="font-semibold">
              Modo {label}
            </span>
          </div>
          <p className="text-muted-foreground text-xs mb-1">
            {apiStatus === 'api'
              ? 'Conectado al backend real'
              : apiStatus === 'error'
              ? 'Backend configurado pero no responde'
              : 'Usando datos de prueba. Sin backend.'}
          </p>
          <p className="text-muted-foreground text-xs mb-3">
            El modo se decide al iniciar sesión.
          </p>
          <button
            onClick={switchMode}
            className="w-full text-left text-xs px-2 py-1.5 rounded-md hover:bg-muted transition-colors"
          >
            🔁 Cambiar a modo {nextLabel}
          </button>
          {forcedMode !== null && (
            <button
              onClick={() => {
                useAppStore.getState().resetForcedMode();
                setOpen(false);
              }}
              className="w-full text-left text-xs px-2 py-1.5 rounded-md hover:bg-muted transition-colors mt-1"
            >
              🔄 Volver a detección automática
            </button>
          )}
        </div>
      )}

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar a modo {pendingMode === 'mock' ? 'Mock' : 'API'}</DialogTitle>
            <DialogDescription>
              Vas a cerrar tu sesión y volver al inicio de sesión. Al iniciar sesión de
              nuevo se usará el modo {pendingMode === 'mock' ? 'Mock' : 'API'}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='bg-transparent'>
            <Button variant="outline" onClick={() => setConfirmOpen(false)} className="rounded-full">
              Cancelar
            </Button>
            <Button onClick={confirmSwitch} className="rounded-full">
              Salir y cambiar a {pendingMode === 'mock' ? 'Mock' : 'API'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
