# Caja — reglas de negocio

1. Toda sesión pertenece a una ubicación y una terminal concretas.
2. Una terminal no puede tener dos sesiones abiertas simultáneas.
3. El fondo inicial forma parte del efectivo esperado, pero no es una venta.
4. Cada movimiento conserva tipo, método, dirección, responsable, fecha y referencia.
5. Los pagos parciales generan movimientos independientes.
6. Reembolsos y reversos no eliminan el movimiento original.
7. Retiros y gastos en efectivo reducen el efectivo esperado.
8. El cierre registra efectivo contado, esperado y diferencia.
9. Una sesión cerrada no admite movimientos nuevos.
10. Los permisos determinan quién abre, registra ajustes, retira y cierra.
