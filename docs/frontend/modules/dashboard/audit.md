# Dashboard — Auditoría funcional

## Overview y shared — auditado

- Saludo del usuario actual.
- Redirección/selección para entrar a una organización.
- Progreso y omisión de onboarding.
- Tour guiado.
- Listado resumido de organizaciones.
- Invitaciones pendientes.
- Resumen de suscripciones.
- Contador de invitaciones en header.
- Navegación responsive, tema y menú de cuenta.

### Corregido

- Usuario, organizaciones, membresías, sucursales, invitaciones, planes, suscripciones e onboarding tienen contratos centrales.
- Saludo, organizaciones, entrada al workspace, invitaciones, contador y suscripciones comparten la misma fuente.
- `User` dejó de contener organización y sucursal.
- El paso “Activa un plan” del resumen se reemplazó por “Revisa las capacidades”, porque el empaquetado comercial aún es provisional.

### Pendiente funcional

- Abrir el diálogo de nueva organización desde el overview.
- Persistir aceptación/rechazo de invitaciones.
- Ejecutar cierre de sesión desde el header y cuenta.
- Notificaciones aún no tienen entidad ni panel.
- El tour depende de selectores del DOM y debe probarse tras cambios de layout.

## Cuenta — auditada

- Perfil personal centralizado; teléfono editable y correo verificable.
- Cambio de contraseña funcional dentro del store local.
- Sesiones centralizadas y revocación de sesiones secundarias funcional.
- Identidades Password, Google, Facebook y Apple modeladas; desconexión funcional y protección del último acceso.
- Preferencias centralizadas; invitaciones, facturación y marketing son configurables. Recuperación y seguridad son obligatorias.
- Cierre de sesión funcional desde header y cuenta.
- Pagos se confirmó como acceso informativo: las suscripciones, métodos de cobro y facturas pertenecen a cada organización.

### Pendientes de integración o producto

- Persistir subida de avatar; el botón continúa como prototipo visual.
- Implementar conexión OAuth real para Google, Facebook y Apple.
- Implementar 2FA; la acción se muestra deshabilitada para no prometer funcionalidad falsa.
- Definir política de invalidación de otras sesiones al cambiar contraseña.
- Incorporar sesión móvil para cerrar sesión desde la vista compacta de cuenta.

## Organizaciones/onboarding — auditado

- El diálogo se abre desde Overview y Organizaciones.
- Nombre y slug crean un borrador local asociado al usuario actual.
- El onboarding usa una ruta contextual por `organizationId`.
- El orden es actividad → capacidades → ubicación condicional → resumen.
- Las sugerencias por rubro dejaron de ser obligaciones.
- La ubicación inicia desactivada; finalizar sin ella produce cero sucursales.
- Los borradores quedan visibles y pueden retomarse desde sus cards.
- El estado mock del dashboard persiste en almacenamiento local.

### Pendiente fuera del prototipo

- Configuración avanzada, invitación y abandono dependen de rutas/permisos del workspace o backend.
- Validación autoritativa de slug, creación transaccional de Owner e idempotencia.
- Ver [issues.md](./issues.md).

## Invitaciones — auditadas

- Overview, página e indicador del header consumen el mismo estado local.
- Aceptar agrega la membresía mock de forma idempotente y mueve la invitación al historial.
- Rechazar conserva la invitación en historial.
- La campana dirige a la bandeja de invitaciones mientras no exista una entidad general de notificaciones.

## Suscripciones — auditadas para prototipo

- Planes, uso, facturas y detalle tienen estados completos de presentación.
- La descarga sin PDF real se identifica como simulada.
- Definiciones comerciales, permisos, cobros y archivos reales permanecen como issues de integración.

## Ayuda — auditada para prototipo

- FAQ, búsqueda visual, contacto, formulario e historial están maquetados.
- Los tickets persisten localmente y las organizaciones del formulario provienen del estado central.
- Correlativos, respuestas y adjuntos quedan para backend.
