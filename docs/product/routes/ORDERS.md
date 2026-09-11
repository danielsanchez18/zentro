# Pedidos

## `/app/[slug]/pedidos`

**Estado:** prototipo completo.

- KPIs, búsqueda, filtros por estado, atención, canal, pago y fecha.
- Tabla/cards, preview y acciones válidas por estado.
- En Vista general debe consolidar únicamente el alcance autorizado.

## `/app/[slug]/pedidos/[orderId]`

**Estado:** prototipo completo.

- Productos, cliente, entrega/recojo, pago, totales y descuento manual.
- Timeline operativo y comentarios internos.
- Seguimiento de courier/delivery.
- Registro de abonos y reembolsos.
- Edición de líneas con historial ante faltantes o cambios.

## Reglas transversales

- Todo pedido conserva canal de origen y ubicación de atención por separado.
- En la primera versión una sola ubicación atiende todo el pedido.
- La reasignación exige permiso, motivo e historial.
- Pago y estado operativo evolucionan independientemente.

Documentación detallada: [Pedidos](../../frontend/modules/orders/README.md).

