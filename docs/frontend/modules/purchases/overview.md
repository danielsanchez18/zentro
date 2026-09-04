# Compras — Overview

**Ruta:** `/app/[slug]/compras`  
**Estado:** Prototipo funcional cerrado; pendiente de QA e integración

## Objetivo

Ofrecer una lectura rápida del abastecimiento de la sucursal y acceso a las órdenes que requieren seguimiento.

## Alcance del prototipo

- [x] KPIs de órdenes abiertas, pendientes de recepción, unidades pendientes y compras registradas.
- [x] Búsqueda por número de orden, proveedor o documento.
- [x] Filtros por estado y proveedor.
- [x] Vista tabla y cards responsive.
- [x] Paginación y estado vacío.
- [x] Vista previa al pulsar una fila o card.
- [x] Acceso al alta y al detalle de una orden.

## Información de cada orden

- Número correlativo.
- Proveedor.
- Fecha de emisión y entrega esperada.
- Cantidad de productos y unidades.
- Total y moneda.
- Progreso de recepción.
- Estado operativo y estado de pago.

## Criterio de cierre

El overview queda cerrado a nivel de prototipo: sus controles funcionan con datos mock, las filas y cards abren un resumen y permiten navegar al detalle, y las nuevas órdenes actualizan inmediatamente el listado y los KPIs.
