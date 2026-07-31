'use client';

import { useAuthStore } from '@/stores/auth-store';
import { useAppStore } from '@/stores/app-store';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { mockMode } = useAppStore();

  const stats = [
    { label: 'Ventas hoy', value: 'S/ 0.00' },
    { label: 'Pedidos pendientes', value: '0' },
    { label: 'Productos activos', value: '0' },
    { label: 'Clientes registrados', value: '0' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">
          Bienvenido, {user?.name || 'usuario'}
        </h1>
        {mockMode && (
          <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
            🟡 Modo Mock — los datos son de prueba. Sin backend conectado.
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-border p-4 bg-card"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border p-6 bg-card">
        <h2 className="font-semibold mb-3">Organización</h2>
        <p className="text-sm text-muted-foreground">
          {user?.email || 'No disponible'}
        </p>
      </div>
    </div>
  );
}
