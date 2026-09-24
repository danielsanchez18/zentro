# Caja

## Objetivo

Caja controla sesiones financieras por ubicación y terminal. Conecta los cobros de POS, Pedidos y Agenda con la persona que los registró, sin obligar a todos los negocios a usar apertura y cierre.

## Alcance del prototipo

1. Overview local de la ubicación activa.
2. Terminales y sesiones abiertas o cerradas.
3. Apertura con fondo inicial y responsable.
4. Movimientos de venta, ingreso, retiro, gasto, reembolso y ajuste.
5. Métodos de pago separados del efectivo físico.
6. Arqueo, cierre y diferencia entre efectivo esperado y contado.
7. Historial consultable y trazabilidad hacia pedido y responsable.

## Decisiones

- Caja es una capacidad opcional y estrictamente local.
- Una terminal solo puede tener una sesión abierta a la vez.
- Abrir un pedido no exige cobrarlo ni abrir caja.
- La organización puede configurar si ciertos cobros exigen sesión abierta.
- Solo movimientos en efectivo modifican el efectivo esperado del cajón.
- Tarjeta, billeteras y transferencias se registran para conciliación, pero no aumentan el efectivo físico.
- Un cierre conserva la diferencia y no reescribe movimientos anteriores.

## Estado

**Prototipo frontend cerrado.** Overview, sesiones, movimientos, detalle, conciliación, terminales y políticas funcionan con mocks. Persistencia e integraciones autoritativas quedan documentadas para backend.

Ver [reglas](./rules.md), [integraciones](./integrations.md) e [issues](./issues.md).
