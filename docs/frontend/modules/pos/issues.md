# Punto de venta — issues de backend e integración

Estos puntos no bloquean la maqueta, pero deben resolverse antes de producción.

## BACKEND — sesión y transacción

- [ ] Definir entidad de sesión/terminal POS y relación con usuario, sucursal y caja.
- [ ] Crear una venta, pagos, comprobante y pedido dentro de una transacción atómica.
- [ ] Definir idempotency key para evitar cobros o pedidos duplicados.
- [ ] Persistir carritos en pausa y definir expiración.
- [ ] Definir correlativos por organización, sucursal, terminal y tipo de comprobante.
- [ ] Registrar auditoría inmutable de descuentos, anulaciones y cambios de precio.
- [ ] Permitir reabrir y modificar pedidos conservando versiones e historial de líneas.
- [ ] Modelar estados independientes de pedido, atención, preparación, pago y comprobante.

## INTEGRACIÓN — catálogo, stock y promociones

- [ ] Consultar catálogo y precios vigentes por sucursal.
- [ ] Validar y reservar stock al confirmar la venta.
- [ ] Resolver concurrencia cuando el stock cambia con el carrito abierto.
- [ ] Integrar el motor de promociones, límites de uso, prioridad y acumulación.
- [ ] Persistir snapshots de producto, variante, precio, promoción e impuestos.

## INTEGRACIÓN — pagos, caja y facturación

- [ ] Exigir caja abierta cuando la configuración lo requiera.
- [ ] Integrar efectivo, terminal de tarjeta, billeteras y transferencias.
- [ ] Definir estados asíncronos, reversos y conciliación de pagos electrónicos.
- [ ] Integrar facturación electrónica, impresión y notas de crédito.
- [ ] Definir tratamiento fiscal de descuentos, delivery, propinas y redondeo.
- [ ] Registrar cada pago parcial con cobrador, caja, turno, referencia y reversos independientes.
- [ ] Definir cuándo se emite comprobante en pedidos abiertos o con pagos parciales.

## INTEGRACIÓN — clientes y pedidos

- [ ] Buscar y crear clientes mediante CRM sin duplicados.
- [ ] Validar direcciones y cobertura de delivery.
- [ ] Publicar el pedido confirmado para el módulo Pedidos/KDS.
- [ ] Definir notificaciones al cliente y tiempos prometidos.
- [ ] Integrar reservas de servicios con Agenda, disponibilidad, duración, recursos y adelantos.

## INTEGRACIÓN — local, puntos de atención y equipo

- [ ] CRUD de puntos de atención por ubicación: mesa, mostrador, cabina, silla, box u otro.
- [ ] Estados en tiempo real: disponible, ocupado, reservado e inactivo.
- [ ] Agrupar y separar mesas temporalmente sin perder identidad ni historial.
- [ ] Evitar doble asignación concurrente de un punto de atención.
- [ ] Vincular responsable de atención y cobrador con miembros activos de Equipo y sus permisos.
- [ ] Registrar cambios de responsable durante la vida del pedido.

## PRODUCCIÓN — permisos y resiliencia

- [ ] Permisos para descuento manual, cambio de precio, anulación y venta a crédito.
- [ ] Estrategia offline, sincronización y resolución de conflictos.
- [ ] Navegación por teclado, lector de código de barras e impresión térmica.
- [ ] Evaluar una librería de decodificación por cámara como fallback para navegadores sin `BarcodeDetector`.
- [ ] Definir protocolos soportados para lectores RFID/NFC que no emulen teclado.
- [ ] Pruebas de doble clic, pérdida de conexión y recuperación tras fallos.
- [ ] QA de accesibilidad, teléfono, tablet y terminal táctil.
