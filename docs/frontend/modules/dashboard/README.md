# Dashboard — Hub personal

> Estado de auditoría: en curso · actualizado 08/09/2026

## Responsabilidad

`/dashboard` es el espacio personal del usuario autenticado. No representa una organización y no debe depender de una sucursal activa. Reúne identidad, organizaciones donde participa, invitaciones, suscripciones, onboarding y soporte.

## Rutas

| Ruta | Propósito | Estado de datos |
|---|---|---|
| `/dashboard` | Resumen personal y entrada a organizaciones | Centralizado |
| `/dashboard/cuenta` | Perfil, seguridad, identidades, notificaciones y pagos | Centralizado y auditado |
| `/dashboard/organizaciones` | Membresías y creación de organizaciones | Listado centralizado; creación local pendiente |
| `/dashboard/invitaciones` | Invitaciones pendientes e historial | Pendiente de migrar |
| `/dashboard/suscripciones` | Suscripciones y facturas por organización | Pendiente de migrar |
| `/dashboard/ayuda` | FAQ, tickets y contacto | Pendiente de migrar |
| `/dashboard/onboarding` | Configuración inicial de una organización | Requiere rediseño por sucursal opcional |

## Fuente local

- Entidades y selectores: `src/lib/mock/dashboard.ts`.
- Contratos: `src/types/dashboard.ts`.
- Los componentes consumen selectores o modelos de vista derivados; no deben declarar copias de usuarios, organizaciones o suscripciones.
- La fuente local simula respuestas persistidas, pero no intenta implementar autorización ni reglas críticas del servidor.

## Hallazgos relevantes

1. El modelo anterior mezclaba usuario, organización y sucursal en `User`.
2. Overview, organizaciones, invitaciones, header y suscripciones tenían datasets contradictorios.
3. El onboarding obliga actualmente a configurar “Tu local”; contradice organizaciones sin sucursal.
4. Acceso presenta Password, Google y Facebook; Apple debe definirse antes de añadirlo a la UI.
5. Varias acciones son solo visuales: aceptar/rechazar invitación, cerrar sesión desde algunos botones, copiar enlace, alta de organización y persistencia del onboarding.

## Orden de auditoría

1. Overview y shared.
2. Cuenta. ✅
3. Organizaciones y onboarding.
4. Invitaciones.
5. Suscripciones y facturas.
6. Ayuda y soporte.

Cada bloque se considera terminado cuando usa el modelo central, sus acciones de prototipo funcionan y sus reglas/contratos quedan documentados.
