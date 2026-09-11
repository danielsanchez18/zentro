# Workspace de organización

## `/app/[slug]` — Overview de la organización

**Estado:** parcial; existe como placeholder.

### Alcance planeado

- En Vista general: KPIs consolidados, ventas y pedidos por canal, comparación de ubicaciones, alertas y actividad reciente.
- En una ubicación: KPIs, ventas, pedidos, stock y operación filtrados a ese contexto.
- Charts adaptados a las capacidades activas; un negocio de servicios prioriza citas y ocupación, uno comercial ventas y stock.
- Tablas compactas de pendientes relevantes: pedidos, bajo stock, citas o tareas.
- Acciones rápidas calculadas por permisos y capacidades.
- Recomendaciones del Centro de configuración cuando falte completar algo.

### Restricciones

- No debe asumir que existen ubicaciones, inventario o ventas.
- Nunca debe mostrar información fuera del alcance del miembro.
- Los datos globales solo aparecen con permiso consolidado.

## Layout compartido

**Estado:** selector inferior implementado; contexto dinámico parcial.

- Un único layout responsive.
- Organización como raíz y ubicación activa opcional.
- Selector inferior con Vista general, ubicaciones disponibles y regreso al Hub.
- Pendiente: capacidades, permisos efectivos, asignaciones y filtrado del sidebar.

Decisiones completas: [workspace y contexto](../../frontend/modules/workspace/README.md).

## `/app/[slug]/equipo`

**Estado:** prototipo existente; requiere alineación.

- Miembros e invitaciones.
- Debe migrar de roles rígidos a Owner/Member, perfiles sugeridos, personalización y alcance de ubicaciones.

## `/app/[slug]/equipo/[memberId]`

**Estado:** prototipo existente; requiere alineación.

- Identidad, estado, perfil de acceso, permisos efectivos, ubicaciones asignadas y actividad.
- Las acciones de propiedad permanecen exclusivas del Owner.

