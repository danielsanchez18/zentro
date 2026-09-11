# Dashboard Hub personal

El Hub pertenece al usuario, no a una organización ni a una ubicación.

## `/dashboard` — Overview personal

**Estado:** completo y auditado para prototipo.

- Saludo, organizaciones, onboarding pendiente, invitaciones, suscripciones y accesos rápidos.
- Permite entrar a una organización válida.
- No muestra KPIs operativos de una sucursal.

## `/dashboard/cuenta`

**Estado:** completo en prototipo.

- Perfil, accesos vinculados, contraseña, sesiones y preferencias.
- Integración OAuth, avatar, 2FA y política de sesiones pendientes.

## `/dashboard/organizaciones`

**Estado:** completo en prototipo.

- Lista membresías, crea un borrador y permite continuar su configuración.
- Crear una organización no crea una ubicación por defecto.

## `/dashboard/organizaciones/[organizationId]/onboarding`

**Estado:** completo en prototipo.

- Actividad del negocio, capacidades iniciales, ubicación opcional y resumen.
- El rubro recomienda; no bloquea ni impone capacidades.

## `/dashboard/invitaciones`

**Estado:** completo en prototipo.

- Pendientes e historial; aceptación y rechazo actualizan el estado local.

## `/dashboard/suscripciones`

**Estado:** prototipo visual auditado.

- Planes, uso, facturas y detalle por organización.
- Empaquetado, cobro y documentos reales pendientes.

## `/dashboard/ayuda`

**Estado:** completo en prototipo.

- FAQ, búsqueda, contacto, creación e historial local de tickets.

## `/dashboard/onboarding`

**Estado:** compatibilidad/redirección. El onboarding vigente debe ser contextual a una organización.

Documentación detallada: [Dashboard Hub](../../frontend/modules/dashboard/README.md).

