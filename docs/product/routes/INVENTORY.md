# Inventario y compras

Inventario es una capacidad opcional. Cuando se controla stock, cada existencia pertenece a una ubicación.

## Inventario — prototipo completo

- `/app/[slug]/inventario` — KPIs, existencias, filtros, vistas y acciones rápidas.
- `/app/[slug]/inventario/movimientos` — Kardex, filtros, detalle en diálogo y registro de movimientos.
- `/app/[slug]/inventario/proveedores` — overview de proveedores.
- `/app/[slug]/inventario/proveedores/agregar` — alta de proveedor.
- `/app/[slug]/inventario/proveedores/[supplierId]` — detalle y productos relacionados.
- `/app/[slug]/inventario/proveedores/[supplierId]/editar` — edición.
- `/app/[slug]/inventario/marcas` — overview y modal de alta/edición.
- `/app/[slug]/inventario/marcas/[brandId]` — detalle de marca.

### Restricciones

- Exige una ubicación concreta para leer o modificar stock.
- Un negocio sin capacidad Inventario no ve estas rutas.
- Ajustes, transferencias y recepciones requieren trazabilidad.

## Compras — prototipo completo

- `/app/[slug]/compras` — órdenes, KPIs, filtros y acciones.
- `/app/[slug]/compras/agregar` — creación de orden de compra.
- `/app/[slug]/compras/[purchaseId]` — detalle, recepción e historial.
- `/app/[slug]/compras/[purchaseId]/editar` — edición válida según estado.

### Restricciones

- Compras abastece al negocio; no representa pedidos de clientes.
- Requiere ubicación de recepción.
- El estado de pago es independiente de la recepción y del stock.

Documentación detallada: [Inventario](../../frontend/modules/inventory/README.md) y [Compras](../../frontend/modules/purchases/README.md).
