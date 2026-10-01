# Roadmap maestro por flujos y páginas

Este roadmap ordena el prototipo frontend. “Completo” no significa listo para producción: los pendientes de backend permanecen en los archivos `issues.md` de cada módulo.

## Fase 1 — Acceso personal

1. **Login** — completo en mock.
   - Email y contraseña, validaciones visuales, recuperación y redirección al Hub.
   - Falta sesión real, usuarios deshabilitados, rate limiting y OAuth.
2. **Signup** — completo en mock.
   - Registro por pasos y acceso al Hub personal.
   - Falta unicidad autoritativa, persistencia y verificación real.
3. **Recuperación** — completa en mock.
   - Solicitud, OTP y nueva contraseña.
   - Falta envío, expiración, intentos e invalidación de servidor.

## Fase 2 — Dashboard Hub

4. **Overview, cuenta, organizaciones, invitaciones, suscripciones y ayuda** — auditados para prototipo.
5. **Onboarding de organización** — completo en mock.
   - Actividad, capacidades, ubicación opcional y resumen.
   - Nunca crea una ubicación implícita.

## Fase 3 — Base del workspace

6. **Layout y selector de contexto** — selector implementado; navegación dinámica pendiente.
7. **WorkspaceContext mock** — implementado.
   - `src/lib/workspace/context.ts` resuelve el contexto compuesto: organización actual, membresía, rol efectivo (desde team-store, con fallback por roleKey), permisos por módulo, capacidades de la org, ubicaciones permitidas por alcance y ubicación activa persistida (puede ser `null`).
   - Sidebar filtra grupos e ítems por permiso efectivo (`view`+) y capacidad activa; oculta módulos no autorizados en lugar de mostrarlos con candados.
   - Resumen (`/app/:slug`) filtra sus accesos directos con el mismo contexto; Reportes reusa `canUseGeneralView` derivado.
   - Pendiente: contexto de canal activo, guard de tenant real y enforcement en rutas/servidor.
8. **Equipo, perfiles, permisos y alcance** — prototipo frontend cerrado.
   - Roles rígidos migrados a entidad `TeamRole` con matriz de permisos por módulo, acciones sensibles y alcance de ubicaciones.
   - Perfiles de sistema (Administrador, Vendedor, Cajero, Contador, Inventario y compras, Contenido y canales) + Owner como titular no asignable.
   - Invitación en flujo perfil → alcance → mensaje; cambio de rol desde lista y detalle con perfiles asignables.
   - Detalle de miembro estilo CRM (cabecera con tabs, resumen de acceso, matriz en solo lectura y timeline).
   - Protecciones de producto: Owner no deshabilitable/eliminable y auto-protección.
   - Pendientes reales: endpoints, auditoría, transferencia de propiedad y enforcement en servidor (issues.md del módulo).
9. **Centro de configuración y ubicaciones** — prototipo frontend cerrado.
   - Hub `/configuracion` con tarjetas de sección (Ubicaciones, Facturación) y atajos a las configuraciones embebidas de otros módulos (caja, agenda, equipo).
   - Sección `configuracion/ubicaciones`: CRUD completo de la entidad flexible "Ubicación" con funciones "¿Qué sucede aquí?" (atención, POS, inventario, preparación, recojo, delivery, citas, presencia pública), contacto, principal y ficha pública opcional.
   - `locations-store` es la fuente de verdad de ubicaciones del workspace: el selector del sidebar y el `WorkspaceContext` reflejan altas, ediciones, publicación y eliminaciones.
   - `configuracion/facturacion` reusa el formulario fiscal del módulo Facturación, cerrando el enlace del dashboard de suscripciones que estaba en 404.
   - Pendientes reales: persistencia y límites del plan por ubicación, validación de funciones contra capacidades y enforcement de permisos en servidor (issues.md del módulo).

## Fase 4 — Comercio y operación

10. **Catálogo** — completo en prototipo.
11. **Inventario** — completo en prototipo.
12. **Compras** — completo en prototipo.
13. **Promociones** — completo en prototipo.
14. **Pedidos** — completo en prototipo.
15. **POS** — prototipo principal cerrado.
   - Equipo/Caja aportarán responsable, cobrador, turno y movimiento financiero.
   - Agenda aportará reservas de servicios y disponibilidad.
   - La persistencia autoritativa permanece documentada como issue de backend.

## Fase 5 — Relación con clientes y servicios

16. **CRM** — completo en prototipo.
   - Fuente única de clientes compartida con POS.
   - Overview, detalle, alta, edición, direcciones, etiquetas, pedidos e historial.
   - Persistencia, consentimientos, deduplicación e identidad autoritativa documentados como issues.
17. **Agenda** — prototipo frontend cerrado.
   - Overview con KPIs y vistas día, semana, mes y lista.
   - Alta, edición/reprogramación, preview, estados, historial y pagos mock.
   - Configuración visual de disponibilidad, recursos y bloqueos; conflictos mock por responsable o recurso.
   - Persistencia autoritativa e integraciones externas documentadas como issues.
18. **Formularios** — prototipo frontend cerrado.
   - Overview, constructor, plantillas, publicación y formulario público implementados.
   - Bandeja, métricas, detalle, estados, historial y conversiones mock implementados.
   - Persistencia, seguridad, archivos y automatizaciones reales documentados como issues de backend.

## Fase 6 — Finanzas

19. **Caja** — prototipo frontend cerrado.
   - KPIs, sesiones, movimientos, filtros, apertura, arqueo y cierre implementados.
   - Detalle histórico, conciliación por método, terminales y políticas configurables implementados.
   - Integraciones autoritativas con POS, Pedidos, Agenda y Equipo documentadas para backend.
20. **Facturación** — prototipo cerrado, con trazabilidad por pedido.
    - Overview con KPIs, búsqueda, filtros (tipo, estado, método de pago, rango de fechas, sesión de caja) y paginación.
    - Detalle con línea de tiempo emitido → enviado → pagado → anulado, ítems, totales, notas de crédito/débito, trazabilidad y snapshot fiscal.
    - Emisión unificada desde Pedidos: el comprobante se registra en Facturación y avanza la secuencia correlativa.
    - Configuración fiscal con correlativos secuenciales (B001/F001/NC001/ND001) e IGV configurable.
    - Pendientes reales: PDF, envío por correo, SUNAT, permisos (issues.md del módulo).
21. **Reportes** — prototipo frontend cerrado.
    - Vista consolidada global con selector de período, KPIs y agregaciones de solo lectura sobre los mocks (ventas, pedidos, rentabilidad, inventario, compras, clientes, citas y canales).
    - Exportación CSV del período; pendientes reales: SQL agregado, PDF en servidor y permisos (issues.md del módulo).

## Fase 7 — Presencia y canales

22. **Canales de venta** — prototipo frontend cerrado.
    - Entidad `SalesChannel` que unifica los "canales" que estaban dispersos en tres unions distintas (`OrderChannel`, `CustomerChannel`, `FormChannel`).
    - Distingue **canales propios** (POS, sitio web, Marketplace Zentro: el pedido nace en Zentro → se activan) de **integraciones externas** (el pedido nace afuera → tienen estado de conexión, no un toggle).
    - Integraciones de WhatsApp, TikTok, Instagram, Shopify y Mercado Libre catalogadas con sus capacidades y deshabilitadas hasta que exista conector.
    - Clave de permiso nueva `canales`, separada de `marketplace`: el perfil "Contenido y canales" opera los canales sin heredar el Marketplace.
    - Tarjeta en el hub de Configuración, que cierra la promesa del copy sobre "canales de venta".
    - Pendientes reales: conectores (OAuth, sincronización de catálogo, recepción de pedidos, pagos, inventario), migración de las unions legacy, contexto de canal activo y guard de servidor (issues.md del módulo).
23. **Marketplace Zentro** — planificado.
24. **CMS/Sitio web** — planificado; Blog vivirá dentro de este módulo.
25. **Marketing** — planificado por audiencias y canales.

## Fase 8 — Gobierno y cierre frontend

26. **Auditoría del workspace** — prototipo cerrado.
    - Registro append-only de solo lectura por organización: quién hizo qué, cuándo y en qué módulo.
    - KPIs (eventos, acciones sensibles, actores únicos, último evento) + filtros combinables (búsqueda, módulo, tipo, gravedad, actor, periodo) y tabla paginada.
    - Taxonomía unificada con la actividad de miembros (`rol`, `acceso`, `invitacion`, `ingreso`, `perfil`) y las de finanzas/operación; los eventos sensibles enlazan con `SENSITIVE_ACTIONS`.
    - Guard por permiso `auditoria` (solo Owner/Administrador); la entrada de sidebar y la ruta `/app/:slug/auditoria` ya funcionan.
    - Pendientes reales: captura de eventos en vivo (`logEvent()`), guard de servidor, persistencia, retención y exportación CSV (issues.md del módulo).
27. **QA responsive, accesibilidad y estados vacíos/error** — transversal.
28. **Auditoría final del frontend y congelamiento de contratos mock**.
29. **Plan de integración backend**, sin reintroducir un selector mock/API.
