# Integraciones — Facturación

## Con Pedidos

### Contrato de entrada

- Facturación recibe del pedido: ID, número, fecha, cliente (nombre, dni/ruc, email), ítems (producto, cantidad, precio, descuento), subtotal, IGV, total, moneda, estado de pago, pagos registrados.
- Un pedido con estado de pago "pagado" o "parcial" habilita la emisión de comprobante.
- Un pedido solo puede tener un comprobante principal asociado.

### Contrato de salida

- Al emitir comprobante, Facturación actualiza el pedido con: `invoiceId`, `invoiceType` (boleta/factura), `invoiceNumber`.
- Esta actualización es informativa; no modifica el estado del pedido.

### Mock actual

- POS y Órdenes generan comprobantes mock al cobrar.
- Facturación asumirá el control de comprobantes reales en integración backend.

---

## Con Caja

### Contrato de entrada

- Caja recibe de Facturación: ID del comprobante asociado a cada movimiento de tipo "venta".
- Cada movimiento de venta puede (opcionalmente) referenciar un `invoiceId`.

### Contrato de salida

- Facturación consulta movimientos de Caja para vincular comprobantes a sesiones.
- El historial de comprobantes puede filtrarse por sesión de Caja.

### Mock actual

- Los movimientos de venta en Caja no referencian comprobantes actualmente.
- La vinculación se implementará en integración backend.

---

## Con POS

### Contrato de entrada

- POS genera un pedido y registra el pago.
- Al confirmar el cobro, POS puede solicitar emisión de comprobante (mock actual).
- POS envía: datos del pedido, datos del cliente, método de pago, monto.

### Contrato de salida

- Facturación devuelve: ID del comprobante, número, tipo, estado, URL de descarga PDF.
- POS muestra el comprobante generado en el resultado de la venta.

### Mock actual

- POS emite boleta/factura mock con datos hardcodeados.
- La integración real con Facturación reemplazará este comportamiento.

---

## Con CRM

### Contrato de entrada

- Facturación consulta datos fiscales del cliente desde CRM: RUC/DNI, razón social/nombre, dirección fiscal, correo electrónico.
- Si el cliente no existe en CRM, Facturación permite registrar datos fiscales temporales.

### Contrato de salida

- Al emitir comprobante con cliente nuevo, Facturación puede crear/actualizar registro en CRM.
- Los datos fiscales del comprobante son snapshot; cambios posteriores en CRM no afectan comprobantes emitidos.

### Mock actual

- CRM provee datos mock del cliente.
- La integración real consultará la API de CRM.

---

## Con Configuración del negocio

### Contrato de entrada

- Configuración provee: RUC del negocio, razón social, dirección fiscal, logo, tasa de IGV, secuencia de correlativos por tipo de comprobante.

### Contrato de salida

- Facturación valida que la configuración fiscal esté completa antes de emitir factura.
- Un comprobante emitido conserva snapshot de la configuración fiscal vigente al momento de emisión.

### Mock actual

- La configuración fiscal se asume completa para efectos del prototipo.

---

## Con Reportes

### Contrato de salida

- Facturación provee datos para reportes de ventas facturadas, comprobantes emitidos, IGV recaudado, notas de crédito/débito.
- Los reportes consultan comprobantes por rango de fechas, tipo, estado y ubicación.

### Mock actual

- No existe integración con Reportes aún.

---

## Proveedor fiscal (futuro)

### Contrato pendiente

- Facturación enviará comprobantes a proveedor de facturación electrónica (SUNAT, etc.).
- El proveedor retornará: XML firmado, hash, fecha de aceptación, código de respuesta.
- Si el proveedor rechaza, el comprobante queda en estado "rechazado" y puede reintentarse.

### Mock actual

- No existe integración con proveedor fiscal.
- Los comprobantes se generan localmente sin validación tributaria.
