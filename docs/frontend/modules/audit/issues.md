# Pendientes — Módulo Auditoría

## 1. Captura de eventos en vivo (principal pendiente)

`useAuditStore.logEvent()` existe pero **ningún módulo lo llama**: el log muestra
solo la semilla mock. Cablear, en este orden:

1. `locations-store` → `ubicacion` / `configuracion` (crear, editar, publicar,
   eliminar, cambiar funciones, marcar principal).
2. `team-store` → `rol`, `acceso`, `invitacion` (`assignRole`,
   `toggleMemberStatus`, envío de invitaciones). Requiere exponer el actor y el
   rol actual desde el store.
3. POS / Facturación → `venta`, `factura`, `anulacion`.
4. Pedidos / Inventario → `pedido`, `devolucion`, `ajuste_stock`.

Al hacerlo, considerar el riesgo de acoplamiento: si cada store importa
`audit-store`, se crea una dependencia entre módulos. Alternativa: que el log se
llame desde la capa de UI (la vista que origina la acción).

## 2. Sin guard de servidor

El bloqueo de `/app/:slug/auditoria` es **solo de UI** (`view.canViewModule`).
Un usuario sin permiso puede abrir la URL y ver el empty state, pero no los
datos. Al conectar la API, el endpoint debe rejectar el acceso por rol.

## 3. Sin persistencia

Todo vive en memoria Zustand: al recargar la página se pierde lo registrado con
`logEvent()`. En producción el log debe ser append-only en el servidor, con
retención definida (p. ej. 12 meses) y sin endpoint de borrado.

## 4. Sin exportación

El plan contempla exportar CSV, pero no se implementó. Al agregarlo: filtrar por
la misma query visible (fechas, módulo, tipo, actor), respetar el permiso
`auditoria` y marcar en el archivo que la extracción está acotada a los
períodos exportados.

## 5. Retención y volumen

La semilla son ~22 eventos. Con datos reales la tabla necesita:

- Índice por `(organizationId, at)` para el listado descendente.
- Paginación por cursor si el log crece (hoy es offset con `Paginator`).
- Agrupar por día en la UI cuando haya miles de filas.

## 6. Taxonomía por confirmar

Los tipos de finanzas (`factura`, `anulacion`, `devolucion`) y de operación
(`pedido`, `cita`, `ajuste_stock`) se definieron aquí para que el módulo no
dependiera de módulos aún no construidos (POS, Pedidos, Agenda). Cuando esos
módulos se construyan, hay que **alinear sus nombres de evento** con esta
taxonomía en lugar de crear una segunda.