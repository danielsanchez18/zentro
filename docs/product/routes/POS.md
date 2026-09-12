# Punto de venta

## `/app/[slug]/pos`

**Estado:** prototipo principal cerrado; integraciones transversales y backend pendientes.

### Alcance

- Terminal vinculada a una ubicación concreta.
- Buscar y explorar el surtido local.
- Carrito con variantes, notas y cantidades.
- Cliente opcional y tipo de atención.
- Promociones automáticas y descuentos manuales autorizados.
- Abrir pedidos sin cobro y continuar modificándolos desde Pedidos.
- Adelantos, pagos parciales o combinados y cálculo de saldo/vuelto.
- Punto de atención configurable, seleccionable y agrupable.
- Emisión mock de comprobante.
- Confirmar crea un pedido con canal POS y ubicación de la terminal.
- Suspender y recuperar ventas durante la sesión.
- Sesión de escaneo múltiple por SKU, código, cámara o lector conectado.

### Restricciones

- No funciona en Vista general; debe seleccionar ubicación.
- No administra el ciclo posterior del pedido, la caja ni el catálogo.
- Stock, precio y promoción se copian como snapshot al confirmar.
- Las citas dependen de Agenda y los cobros reales de Caja; el prototipo mantiene sus contratos mock.

### Dependencias para iniciar

- WorkspaceContext mock y ubicación activa.
- Catálogo, inventario, promociones y pedidos ya prototipados.
- Caja y facturación pueden comenzar simuladas y quedan como integraciones posteriores.

Plan detallado: [Punto de venta](../../frontend/modules/pos/README.md).
