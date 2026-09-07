# Pedidos — Detalle

**Ruta:** `/app/[slug]/pedidos/[orderId]`  
**Estado:** Prototipo funcional

Incluye productos y notas, snapshot financiero, promoción aplicada, cliente, contacto, atención, dirección, método y referencia de pago, timeline operativo y acciones válidas por estado.

El resumen, la promesa de entrega, el timeline horizontal y los productos se presentan dentro de una única superficie para replicar la lectura de seguimiento que tendría el cliente. Cliente, pago y courier permanecen separados como información administrativa complementaria.

Los pedidos delivery incorporan un bloque de seguimiento con repartidor, vehículo, contacto, ETA y representación mock de ubicación. En producción la posición en tiempo real deberá recibirse desde un servicio de tracking por WebSocket o eventos equivalentes.

El prototipo permite asignar o cambiar repartidor y avanzar el recorrido por `asignado`, `recogido`, `en camino` y `entregado`. Cada cambio actualiza el tracking y agrega el evento correspondiente al timeline interno.

La card financiera permite registrar varios abonos, consultar el saldo, emitir un comprobante mock y registrar reembolsos parciales o totales. El estado de pago se deriva de las operaciones y permanece separado del estado operativo.

La cancelación exige un motivo, admite una nota interna y queda registrada en el timeline. Los pedidos entregados y cancelados bloquean las acciones operativas incompatibles.

Mientras el pedido está `nuevo`, `confirmado` o `en preparación`, el equipo puede editar sus líneas desde un modal: agregar productos, retirar o reemplazar productos agotados y ajustar cantidades. El selector consulta el stock mock de Inventario y evita incorporar productos sin disponibilidad.

También puede aplicarse un descuento directo fijo o porcentual. Las promociones se conservan separadas y cada modificación exige un motivo. El timeline permite desplegar el snapshot de productos y descuento antes y después del ajuste.
