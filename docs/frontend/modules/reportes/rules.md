# Reglas de negocio — Reportes

## Alcance y globalidad

1. Reportes es un módulo de solo lectura: agrega información de Pedidos, Caja, Facturación, Inventario, Compras, CRM y Agenda.
2. La vista consolidada está disponible para roles globales (OWNER/ADMIN). Con una ubicación activa se filtran los datos que tengan ubicación (`locationName`/`locationId`): movimientos de caja (vía sesión) y citas de Agenda. Los pedidos, inventario, compras y CRM no tienen ubicación en el mock y se muestran globales; el backend agregará `locationId` para filtrarlos.
3. El período seleccionado (hoy, 7, 30, 90 días, todo) se aplica a toda métrica con fecha; el resto (stock, inventario) se presenta como "al momento".

## Ventas

4. Las ventas del período se calculan sobre pedidos con pago registrado (`pagado` o `parcial`); los pedidos cancelados o reembolsados se excluyen.
5. La serie por día suma el `total` de los pedidos elegibles agrupados por fecha de creación.
6. La distribución por canal (POS, sitio web, marketplace) se calcula desde `channel` del pedido.
7. La distribución por método de pago se calcula desde los movimientos tipo `venta` de Caja y de `paymentMethod` de pedidos sin movimiento.

## Pedidos

8. La distribución por estado (nuevo, confirmado, en preparación, listo, entregado, cancelado) cuenta pedidos del período.
9. La distribución por tipo de servicio (mesa, recojo, delivery) cuenta pedidos del período.
10. El ticket promedio es `ventas totales / número de pedidos` del período.

## Rentabilidad

11. El margen bruto estimado de una línea se calcula como `total línea − (cantidad × costo unitario)`. El costo se resuelve por `productId` en el inventario; si no está inventariado, por nombre; si tampoco, se estima con la tasa de costo estándar del mock (58% del precio de venta).
12. El margen global es la suma de márgenes de las líneas vendidas en el período, excluyendo descuentos en el costo (los descuentos del pedido ya restan en el total de la línea).
13. Los productos top se ordenan por contribución (margen total) descendente.

## Inventario y compras

14. Stock crítico: ítems con estado `bajo` o `agotado` (según `inventoryStatus`).
15. El valor del inventario al momento se calcula como `currentStock × unitCost` por ítem, sumado globalmente.
16. Las compras del período suman `total` de órdenes de compra emitidas en el rango, agrupadas por proveedor.

## Clientes y citas

17. Top clientes por gasto: los `crmCustomers` con mayor `totalSpent`, mostrando pedidos y última compra.
18. Clientes nuevos del período: cuentas con `createdAt` dentro del rango.
19. Citas por estado (confirmada, completada, cancelada, no asistió) se cuentan en el período desde `appointments`.

## Presentación

20. Los valores monetarios usan formato `es-PE` PEN.
21. Las proporciones (canales, métodos, estados, proveedores) se muestran como barras de progreso con porcentaje; sin librería de gráficos externa.
22. Los datos vacíos de un período muestran estado vacío claro en la sección correspondiente.