# Módulo Auditoría (`/app/:slug/auditoria`)

> Roadmap **tarea 26 · Fase 8**. Prototipo frontend (datos mock en Zustand).

Registro **append-only** y de **solo lectura** de la actividad del workspace:
quién hizo qué, cuándo y en qué módulo. El log no permite editar ni eliminar
eventos; solo agregar.

## Alcance

- **Vista por organización**: cada org ve únicamente sus propios eventos.
- **KPIs**: eventos registrados, acciones sensibles, actores únicos y último evento.
- **Filtros combinables**: búsqueda libre, módulo, tipo, gravedad, actor y periodo.
- **Tabla paginada**: fecha-hora · actor (+rol) · evento (descripción + entidad) ·
  módulo · ubicación · gravedad.
- **Guard de permiso**: usa `auditoria` del workspace context. Solo Owner y
  Administrador entran; el resto ve un empty state explicativo.

## Permisos

`auditoria` ya existía en el catálogo `PERMISSION_MODULES` (`src/lib/mock/team.ts`):

| Rol | Nivel |
|---|---|
| Owner | `admin` |
| Administrador | `admin` |
| Roles estándar (vendedor, cajero, contador, etc.) | `none` |

La entrada del sidebar (`/auditoria`) y la etiqueta del breadcrumb ya estaban
mapeadas; este módulo completa la ruta que faltaba.

## Archivos

| Archivo | Rol |
|---|---|
| `src/lib/mock/audit.ts` | Modelo `AuditEvent`, taxonomía `AuditEventType`, catálogo `AUDIT_EVENT_TYPES` y semilla `seedAuditEvents` (~22 eventos en septiembre 2026). |
| `src/stores/audit-store.ts` | Estado + `logEvent()` + selectores (`eventsByOrganization`, `kpisByOrganization`, `actorsByOrganization`). |
| `src/components/app/audit/AuditModule.tsx` | Contenedor: guard, filtros, filtrado, paginación y composición. |
| `src/components/app/audit/AuditKPI.tsx` | Tarjetas de métricas. |
| `src/components/app/audit/AuditFiltersBar.tsx` | Búsqueda + selects de módulo/tipo/gravedad/actor/periodo + "Limpiar filtros". |
| `src/components/app/audit/AuditTable.tsx` | Tabla de eventos con `StatusBadge` para la gravedad. |
| `src/app/app/[slug]/auditoria/page.tsx` | Ruta del workspace. |

## Taxonomía de eventos

Los primeros cinco tipos coinciden con `MemberAuditType` del módulo Equipo para
que la actividad de miembros y la de negocio vivan en el mismo registro:

`rol`, `acceso`, `invitacion`, `ingreso`, `perfil` (equipo) · `venta`, `factura`,
`anulacion`, `devolucion` (finanzas) · `pedido`, `cita`, `ajuste_stock`
(operación) · `ubicacion`, `configuracion` (configuración).

Cada tipo tiene ícono y módulo por defecto en `AUDIT_EVENT_TYPES`.

## Gravedad y acciones sensibles

- `severity: "routine" | "sensitive"`.
- Los eventos sensibles enlazan con `SensitiveAction` del catálogo existente
(`cambiar_roles`, `invitar_miembros`, `anular_comprobante`, `reembolsar`,
`ajustar_stock`), de modo que la banda "Solo lectura · acciones sensibles
visibles" solo aparece para quien tiene nivel `admin`.

## Captura de eventos en vivo

`useAuditStore.logEvent(input)` está listo para que cada módulo registre su
actividad, pero **aún no está cableado**. Ver `issues.md`.

## Cómo probarlo

1. `/app/las-rocas/auditoria` (Owner): 12 eventos, 4 sensibles, 6 actores.
2. Filtrar por gravedad `Sensible` → 4 eventos.
3. Buscar `boleta` combinado con `Sensible` → 1 evento ("Anuló la boleta B001-0014").
4. `Limpiar filtros` → vuelve a 12.
5. `/app/cafe-del-valle/auditoria` (Admin): 6 eventos, solo los de esa org.
6. `/app/fonda-la-abuela/auditoria` (Miembro/Vendedor): "Sin acceso a la auditoría".