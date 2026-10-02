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

**Estado:** selector inferior implementado; contexto resuelto con permisos y alcance.

- Un único layout responsive.
- Organización como raíz y ubicación activa opcional.
- Selector inferior con Vista general, ubicaciones permitidas (según rol) y regreso al Hub.
- `WorkspaceContext` mock implementado en `src/lib/workspace/context.ts` + hook `useWorkspaceContextView(slug)`: organizacion, membresía, rol efectivo (permisos por módulo desde team-store), capacidades de la org, ubicaciones permitidas y ubicación activa persistida.
- El sidebar filtra grupos e ítems por permiso `view`+ y capacidad activa; el Resumen filtra accesos directos igual.
- Pendiente: contexto de canal activo, capacidades por ubicación y validación en rutas/servidor.

Decisiones completas: [workspace y contexto](../../frontend/modules/workspace/README.md).

## `/app/[slug]/equipo`

**Estado:** prototipo frontend cerrado (mock).

- Miembros, invitaciones y **Roles y permisos** (3 tabs).
- Roles no rígidos: entidad `TeamRole` con matriz de permisos por módulo, acciones sensibles y alcance de ubicaciones (todas o seleccionadas).
- Perfiles de sistema precargados + roles custom (crear/editar/duplicar/eliminar; Owner bloqueado como titular no asignable).
- Invitación en flujo: correo → perfil sugerido → alcance → mensaje → enviar; la invitación guarda rol + scope.

## `/app/[slug]/equipo/[memberId]`

**Estado:** prototipo frontend cerrado (mock).

- Cabecera estilo CRM con banner, avatar/iniciales, estado, rol, último acceso y tabs (Resumen / Acceso y permisos / Actividad).
- Aside sticky: identidad, incorporación, rol y alcance.
- Resumen de permisos efectivos por dominio, matriz completa en solo lectura, acciones sensibles y timeline de actividad.
- Las acciones de propiedad (transferir, eliminar en cascada) permanecen exclusivas del Owner; el Owner no se deshabilita ni elimina.

## `/app/[slug]/configuracion`

**Estado:** prototipo frontend cerrado (mock).

- Hub con tarjetas de sección (Ubicaciones, Facturación) y atajos a las configuraciones embebidas de otros módulos (caja, agenda, equipo).
- Visible solo para roles con permiso `view`+ en el módulo `configuracion`.

## `/app/[slug]/configuracion/ubicaciones`

**Estado:** prototipo frontend cerrado (mock).

- CRUD de la entidad flexible **Ubicación**: una ubicación no tiene tipo rígido; sus funciones se configuran con "¿Qué sucede aquí?" (atención al público, POS, inventario, preparación, recojo, delivery, citas, presencia pública).
- Datos de contacto, marca de ubicación principal y ficha pública opcional (publicar/ocultar, título y descripción).
- `locations-store` es la fuente de verdad de ubicaciones del workspace: el selector del sidebar y el `WorkspaceContext` reflejan el CRUD.

## `/app/[slug]/configuracion/facturacion`

**Estado:** prototipo frontend cerrado (mock).

- Reusa el formulario de datos fiscales del módulo Facturación (razón social, RUC, IGV, dirección, logo, numeración y plantilla de comprobante).

Decisiones completas: [centro de configuración y ubicaciones](../../frontend/modules/configuration/README.md).

## `/app/[slug]/auditoria`

**Estado:** prototipo frontend cerrado (mock).

- Registro de actividad **append-only** y de solo lectura, acotado a la organización del workspace: quién hizo qué, cuándo y en qué módulo.
- KPIs (eventos registrados, acciones sensibles, actores únicos, último evento), filtros combinables (búsqueda, módulo, tipo, gravedad, actor, periodo) y tabla paginada.
- Taxonomía unificada con la actividad de miembros y con finanzas/operación; los eventos sensibles enlazan con el catálogo `SENSITIVE_ACTIONS`.
- Requiere nivel `view` en `auditoria` (en la práctica, Owner/Administrador); el resto de roles ve un estado explicativo sin acceso.

Decisiones completas: [auditoría del workspace](../../frontend/modules/audit/README.md).

## `/app/[slug]/canales`

**Estado:** prototipo frontend cerrado (mock).

- Entidad `SalesChannel` que unifica el concepto de canal, antes disperso en tres unions distintas (`OrderChannel`, `CustomerChannel`, `FormChannel`).
- **Canales propios** (Punto de venta, Sitio web, Marketplace Zentro): el pedido nace dentro de Zentro → se activan/desactivan; desactivar no borra el historial.
- **Integraciones externas** (WhatsApp, TikTok, Instagram, Shopify, Mercado Libre): el pedido nace afuera → tienen estado de conexión en lugar de un toggle. Catalogadas con sus capacidades, deshabilitadas hasta que exista conector.
- KPIs (activos, propios, que reciben pedidos, integraciones conectadas), tabla con activar/desactivar/editar y catálogo de plataformas.
- Requiere el permiso `canales` (nuevo, separado de `marketplace`); el perfil "Contenido y canales" lo tiene en `operate`.

Decisiones completas: [canales de venta](../../frontend/modules/channels/README.md).

## `/app/[slug]/presencia`

**Estado:** prototipo frontend cerrado (mock).

- Constructor de sitios por bloques ("Mi sitio web"). Los 10 bloques de la spec, reordenables y ocultables, con preview de solo lectura.
- **Editar no es publicar.** La spec exige entorno de desarrollo y publicación manual, así que el sitio tiene `lastPublishedAt`; lo editado después queda pendiente y el visitante no lo ve hasta pulsar Publicar.
- El sitio pertenece a la organización, **no a una sucursal**: el módulo ignora el selector de ubicación a propósito.
- Objetivos del sitio (informativo, captar leads, reservas, vender) y dominio público. El plan decide el dominio: Esencial solo subdominio `zentro.app`; Crecimiento además dominio propio. Cuando el plan no alcanza, la opción aparece deshabilitada con el motivo.
- Diseño por plantilla (4) más tokens de personalización. Sin HTML, CSS ni JS propio: la spec lo prohíbe por seguridad.
- **Desacoplado de Canales a propósito:** publicar el catálogo no habilita carrito ni pedidos, porque la spec dice que no obliga.
- Decisión de scope: solo Constructor Web. Blog queda como módulo aparte, así que el bloque Blog apunta a artículos que todavía no existen.
- Requiere el permiso `presencia`.

Decisiones completas: [constructor web](../../frontend/modules/presencia/README.md).

