# Caja — contratos de integración

## POS

- Un cobro confirmado genera un movimiento por cada método utilizado.
- El movimiento conserva `orderId`, sesión, terminal, ubicación, cobrador y referencia externa.
- Si la política exige sesión para ese método, POS debe bloquear el cobro cuando no exista una sesión abierta.

## Pedidos

- Pagos parciales producen movimientos independientes y no reemplazan pagos anteriores.
- Reembolsos y reversos crean movimientos de salida enlazados al movimiento original.
- Cambiar un pedido no altera movimientos ya confirmados; cualquier diferencia se resuelve con un nuevo pago o reembolso.

## Agenda

- Adelantos, pagos parciales y saldos siguen las mismas reglas de Caja.
- Crear una cita no crea movimiento hasta que exista un pago confirmado.

## Equipo

- Apertura, movimiento, retiro, ajuste y cierre conservan el miembro responsable.
- Los permisos se evalúan por acción y por ubicación.
- Deshabilitar a un miembro no borra su historial financiero.

## Reglas técnicas futuras

- Cada integración debe enviar una clave de idempotencia.
- El backend valida que la sesión siga abierta antes de aceptar el movimiento.
- Los importes y saldos autoritativos nunca dependen del cálculo del navegador.
