# Inventario — Overview

**Ruta:** `/app/[slug]/inventario`  
**Estado:** Prototipo en desarrollo

## Objetivo

Dar una lectura rápida de las existencias de la sucursal activa y permitir operaciones frecuentes sin abandonar el overview.

## Funcionalidades del prototipo

### Resumen

- [x] KPI de unidades disponibles.
- [x] KPI de productos con stock bajo.
- [x] KPI de productos agotados.
- [x] KPI del valor del inventario al costo.
- [x] Actualización inmediata de KPIs al modificar existencias.

### Exploración

- [x] Búsqueda por producto, SKU, marca o proveedor.
- [x] Filtro por estado del stock.
- [x] Filtro por categoría.
- [x] Vista tabla.
- [x] Vista cards.
- [x] Paginación.
- [x] Estado vacío.
- [x] Adaptación móvil.

### Acciones por producto

- [x] Abrir resumen desde una fila o card.
- [x] Registrar entrada individual.
- [x] Registrar entrada por lote.
- [x] Registrar salida sin utilizar unidades reservadas.
- [x] Editar stock mínimo.
- [x] Consultar historial local de movimientos.
- [x] Registrar ajuste manual de stock físico.
- [ ] Abrir la pantalla completa de Movimientos / Kardex.
- [ ] Navegar al detalle de existencia del producto.

## Reglas del prototipo

- `stock disponible = stock físico - stock reservado`, con mínimo cero.
- Un producto está agotado cuando su stock disponible es cero.
- Un producto tiene stock bajo cuando su disponibilidad es menor o igual al mínimo configurado.
- Una salida no puede consumir unidades reservadas.
- Un ajuste manual debe registrar la diferencia entre el stock anterior y el nuevo conteo.
- Toda entrada, salida o ajuste debe generar un movimiento local.

## Pendiente antes de cerrar el prototipo

- [x] Añadir motivo y observaciones a las salidas.
- [x] Validar completamente el registro por lote.
- [x] Evitar productos repetidos dentro de un lote.
- [x] Aplicar el costo unitario ingresado en una entrada.
- [x] Guardar motivo, documento y observaciones en los movimientos locales.
- [x] Corregir advertencias y errores de lint.
- [ ] Probar interacciones en escritorio y teléfono.

## Pendiente de backend

- Persistencia de existencias, mínimos y movimientos.
- Carga inicial por sucursal.
- Manejo de errores y reintentos.
- Control de concurrencia para evitar stock inconsistente.
- Permisos para entradas, salidas y ajustes.
- Auditoría del usuario responsable.
- Paginación, búsqueda y filtros desde servidor.

## Componentes actuales

```text
inventory/overview/
├── InventoryModule.tsx
├── InventoryHeader.tsx
├── InventoryKpis.tsx
├── InventoryList.tsx
├── InventoryTable.tsx
├── InventoryCard.tsx
├── InventoryItemActions.tsx
├── InventoryPreviewDialog.tsx
├── RegisterEntryDialog.tsx
├── RegisterOutputDialog.tsx
├── MinimumStockDialog.tsx
├── InventoryHistoryDialog.tsx
└── types.ts
```

## Criterio de cierre del prototipo

El overview se considera cerrado cuando todas las operaciones visibles modifican el estado local correctamente, generan un movimiento comprensible, actualizan KPIs/listados y no producen errores de TypeScript o ESLint.
