# Progreso actual

**Última actualización:** 30 de septiembre de 2026.

## Estado general

- Landing: existente, auditoría aplazada por decisión del producto.
- Auth y recuperación: prototipo mock implementado; integración y seguridad de servidor pendientes.
- Dashboard Hub: auditado y corregido para crear organizaciones sin ubicación obligatoria.
- Layout del workspace: decisiones cerradas; selector inferior de contexto implementado.
- Catálogo: prototipo de productos y categorías completo.
- Inventario: prototipo completo.
- Compras: prototipo completo.
- Promociones: prototipo completo.
- Pedidos: prototipo completo.
- Equipo: prototipo frontend cerrado. Roles rígidos migrados a entidad `TeamRole` con matriz de permisos por módulo, acciones sensibles, alcance de ubicaciones y perfiles de sistema (Admin, Vendedor, Cajero, Contador, Inventario, Contenido) + Owner como titular no asignable. Invitación en flujo perfil → alcance → mensaje. Detalle de miembro estilo CRM (cabecera con tabs, resumen de acceso, matriz en solo lectura, timeline). Protecciones de Owner y auto-protección. Pendientes reales (endpoints, auditoría, transferencia de propiedad) documentados en issues.md.
- WorkspaceContext mock: implementado. `src/lib/workspace/context.ts` resuelve organización, membresía, rol efectivo (team-store con fallback por roleKey), permisos por módulo, capacidades de la org, ubicaciones permitidas por alcance y ubicación activa persistida. El sidebar y los accesos directos del Resumen filtran su navegación por permisos efectivos y capacidades; Reportes reusa el contexto para la vista general.
- POS: prototipo principal cerrado; cruces con Equipo/Caja, Agenda y backend documentados.
- CRM: prototipo cerrado, con CRUD, detalle, acciones rápidas y conexión con POS.
- Agenda: prototipo frontend cerrado; overview, cuatro vistas, operación, configuración y trazabilidad mock implementados.
- Formularios: prototipo frontend cerrado; flujo completo de creación, publicación, captura, revisión, historial y conversión mock.
- Caja: prototipo frontend cerrado con sesiones, movimientos, arqueo, historial, conciliación y configuración.
- Facturación: prototipo frontend cerrado. Overview con KPIs, filtros (tipo, estado, método de pago, fecha, sesión de caja) y paginación; detalle con línea de tiempo (emitido → enviado → pagado → anulado), ítems, totales, notas de crédito/débito, trazabilidad y snapshot de configuración fiscal; emisión unificada desde Pedidos que registra el comprobante en Facturación; configuración fiscal con correlativos secuenciales. Pendientes reales (PDF, correo, SUNAT, permisos) documentados en issues.md.
- Reportes: prototipo frontend cerrado. Vista consolidada global con selector de período (hoy/7/30/90/todo), KPIs (ventas, pedidos, ticket promedio, clientes activos), series de ventas por día, distribución por canal y método de pago, pedidos por estado y servicio, rentabilidad estimada por producto, stock crítico + valorización, compras por proveedor, top clientes y citas por estado. Exportación CSV mock del período. Pendientes reales (SQL agregado, PDF servidor, permisos) documentados en issues.md.
- Centro de configuración y ubicaciones: prototipo frontend cerrado. Hub en `/configuracion` con tarjetas de sección y atajos a configuraciones de otros módulos. CRUD de la entidad flexible "Ubicación" con funciones "¿Qué sucede aquí?" (atención, POS, inventario, preparación, recojo, delivery, citas, presencia pública), contacto, principal y ficha pública opcional. `locations-store` quedó como fuente de verdad de ubicaciones del workspace, por lo que el selector del sidebar y el `WorkspaceContext` reflejan el CRUD. `configuracion/facturacion` reusa el formulario fiscal y cierra el enlace del dashboard que estaba en 404. Pendientes reales (persistencia, límites del plan, validación de funciones, enforcement) documentados en issues.md.
- Auditoría del workspace: prototipo frontend cerrado. Registro append-only y de solo lectura por organización, con actor, rol, fecha, módulo, ubicación y gravedad; los eventos sensibles enlazan con el catálogo `SENSITIVE_ACTIONS`. KPIs (eventos, sensibles, actores únicos, último evento), filtros combinables (búsqueda, módulo, tipo, gravedad, actor, periodo), tabla paginada y guard por permiso `auditoria` (solo Owner/Administrador). La ruta `/app/:slug/auditoria` completa la entrada que ya existía en el sidebar. Pendientes reales (captura en vivo con `logEvent()`, guard de servidor, persistencia, retención, exportación CSV) documentados en issues.md.
- Canales de venta: prototipo frontend cerrado. Entidad `SalesChannel` que unifica las tres unions de canal que existían dispersas (`OrderChannel`, `CustomerChannel`, `FormChannel`). Distingue canales propios (POS, sitio web, Marketplace Zentro: el pedido nace en Zentro, se activan/desactivan sin borrar historial) de integraciones externas (WhatsApp, TikTok, Instagram, Shopify, Mercado Libre: el pedido nace afuera, tienen estado de conexión en vez de toggle), ya catalogadas con sus capacidades pero sin conector. Nueva clave de permiso `canales`, separada de `marketplace`, que permite que "Contenido y canales" opere los canales sin heredar el Marketplace. Tarjeta agregada al hub de Configuración. Pendientes reales (conectores, migración de unions legacy, contexto de canal activo, guard de servidor) documentados en issues.md.
- Constructor Web / Mi sitio web: prototipo frontend cerrado. Constructor por bloques con los 10 bloques de la spec, reordenables y ocultables, con preview de solo lectura. La regla que estructura el módulo es "editar no es publicar": la spec exige entorno de desarrollo y publicación manual, así que el sitio tiene fecha de última publicación y las páginas editadas después quedan pendientes hasta que alguien pulsa Publicar. El sitio pertenece a la organización y no a una sucursal, por lo que el módulo ignora el selector de ubicación a propósito. El plan decide el dominio (Esencial solo subdominio; Crecimiento también dominio propio) y cuando no alcanza la opción se muestra deshabilitada con el motivo. Solo tokens de diseño, porque la spec prohíbe inyectar HTML, CSS o JS. Desacoplado de Canales a propósito: publicar el catálogo no habilita carrito ni pedidos. Decisión de scope: solo Constructor Web, Blog queda aparte. Pendientes reales (drag & drop, bloques con contenido real, slug y SEO, verificación de dominio, persistencia, guard de servidor) en issues.md.
- Presencia (Marketplace, Blog, Marketing): planificados, sin ruta funcional.

## Trabajo activo

- (ninguno) — Equipo, WorkspaceContext, Centro de configuración, Auditoría, Canales de venta y Constructor Web cerrados a nivel prototipo frontend.

## Siguiente entrega

1. Blog (módulo aparte, ya con el bloque del sitio prepared para consumirlo) o Marketplace (23), que es donde caerán las integraciones externas.
2. Conservar los contratos backend de Caja, Facturación, Configuración, Auditoría, Canales y Constructor Web para la etapa de integración.
3. Auditoría QA transversal (responsive, accesibilidad, estados vacíos/error).
