# Compras — Órdenes de compra

**Estado:** Prototipo funcional completo; pendiente de persistencia y permisos.

## Datos de cabecera

- Proveedor.
- Fecha de emisión.
- Fecha estimada de entrega.
- Moneda.
- Condición de pago.
- Referencia o número de documento externo.
- Almacén o sucursal activa.
- Notas para el proveedor y observaciones internas.

## Líneas

Cada línea contiene producto, SKU, cantidad solicitada, unidad de medida, costo unitario, impuesto, descuento y subtotal. El costo acordado pertenece a la orden y no debe depender del costo actual del catálogo.

## Acciones por estado

- Borrador: editar, enviar o cancelar.
- Enviada: registrar recepción o cancelar si no existen recepciones.
- Parcial: registrar otra recepción o consultar lo pendiente.
- Recibida: consultar y exportar; no editar cantidades.
- Cancelada: consultar; no recibir ni editar.

## Implementado en el prototipo

- [x] Alta y edición mediante formulario reutilizable.
- [x] Selección de proveedores activos con el `Select` compartido.
- [x] Líneas dinámicas sin productos duplicados.
- [x] Validación de fechas, cantidades y costos.
- [x] Resumen automático de productos, unidades y total.
- [x] Guardado inicial como borrador.
- [x] Envío, cancelación y eliminación de borradores con confirmación.
- [x] Restricción de edición a órdenes en borrador.

## Fuera del primer prototipo

- Aprobaciones por monto.
- Cotizaciones comparativas.
- Órdenes recurrentes.
- Devoluciones al proveedor.
- Integración contable y cuentas por pagar.
