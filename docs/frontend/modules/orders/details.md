# Pedidos — Detalle

**Ruta:** `/app/[slug]/pedidos/[orderId]`  
**Estado:** Prototipo funcional

Incluye productos y notas, snapshot financiero, promoción aplicada, cliente, contacto, atención, dirección, método y referencia de pago, timeline operativo y acciones válidas por estado.

El resumen, la promesa de entrega, el timeline horizontal y los productos se presentan dentro de una única superficie para replicar la lectura de seguimiento que tendría el cliente. Cliente, pago y courier permanecen separados como información administrativa complementaria.

Los pedidos delivery incorporan un bloque de seguimiento con repartidor, vehículo, contacto, ETA y representación mock de ubicación. En producción la posición en tiempo real deberá recibirse desde un servicio de tracking por WebSocket o eventos equivalentes.

El prototipo permite asignar o cambiar repartidor y avanzar el recorrido por `asignado`, `recogido`, `en camino` y `entregado`. Cada cambio actualiza el tracking y agrega el evento correspondiente al timeline interno.
