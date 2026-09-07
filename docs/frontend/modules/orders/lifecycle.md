# Pedidos — ciclo operativo

## Transiciones

```text
nuevo → confirmado → en_preparacion → listo → entregado
  └─────────────── cancelado ───────────────────────┘
```

- `nuevo → confirmado`: el negocio acepta el pedido.
- `confirmado → en_preparacion`: comienza la elaboración o alistamiento.
- `en_preparacion → listo`: todos los productos están preparados.
- `listo → entregado`: el cliente recibió el pedido o salió a despacho.
- `nuevo|confirmado|en_preparacion|listo → cancelado`: requiere confirmación y motivo.

## Pago

El pago no se usará como sustituto del estado operativo. Un pedido puede estar pagado antes de prepararse o entregarse con pago pendiente, dependiendo de la configuración futura del negocio.

## Stock

El prototipo mostrará el efecto esperado, pero la integración debe definir cuándo reservar y descontar unidades. La decisión recomendada para iniciar es reservar al confirmar y descontar al entregar, liberando la reserva al cancelar.

## Promociones

Cada línea conservará el precio base, descuento aplicado y precio final. El pedido guardará una referencia y una copia histórica de la promoción para que cambios posteriores no alteren ventas existentes.

## Historial

El detalle mostrará una línea de tiempo con fecha, estado, actor y nota. En producción este historial debe provenir de auditoría inmutable del backend.
