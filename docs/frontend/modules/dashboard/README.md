# Dashboard — Hub personal

> Estado de auditoría: en curso · actualizado 09/09/2026

## Responsabilidad

`/dashboard` es el espacio personal del usuario autenticado. No representa una organización y no debe depender de una sucursal activa. Reúne identidad, organizaciones donde participa, invitaciones, suscripciones, onboarding y soporte.

## Rutas

| Ruta | Propósito | Estado de datos |
|---|---|---|
| `/dashboard` | Resumen personal y entrada a organizaciones | Centralizado |
| `/dashboard/cuenta` | Perfil, seguridad, identidades, notificaciones y pagos | Centralizado y auditado |
| `/dashboard/organizaciones` | Membresías y creación de organizaciones | Prototipo local funcional y auditado |
| `/dashboard/invitaciones` | Invitaciones pendientes e historial | Estado local funcional y auditado |
| `/dashboard/suscripciones` | Suscripciones y facturas por organización | Prototipo UI auditado; integración pendiente |
| `/dashboard/ayuda` | FAQ, tickets y contacto | Prototipo local auditado |
| `/dashboard/organizaciones/[organizationId]/onboarding` | Configuración contextual de una organización | Prototipo local funcional y auditado |
| `/dashboard/onboarding` | Ruta antigua | Redirige a Organizaciones |

## Fuente local

- Entidades y selectores: `src/lib/mock/dashboard.ts`.
- Contratos: `src/types/dashboard.ts`.
- Los componentes consumen selectores o modelos de vista derivados; no deben declarar copias de usuarios, organizaciones o suscripciones.
- La fuente local simula respuestas persistidas, pero no intenta implementar autorización ni reglas críticas del servidor.

## Hallazgos relevantes

1. El modelo anterior mezclaba usuario, organización y sucursal en `User`.
2. Overview, organizaciones, invitaciones, header y suscripciones tenían datasets contradictorios.
3. El onboarding ya permite terminar sin sucursal y solo muestra el paso de ubicación cuando puede aportar valor.
4. Acceso presenta Password, Google y Facebook; Apple debe definirse antes de añadirlo a la UI.
5. La creación y el onboarding funcionan con estado local persistente. Las integraciones y reglas de servidor están separadas en `issues.md`.

## Orden de auditoría

1. Overview y shared.
2. Cuenta. ✅
3. Organizaciones y onboarding. ✅
4. Invitaciones. ✅
5. Suscripciones y facturas. ✅ para prototipo
6. Ayuda y soporte. ✅ para prototipo

Cada bloque se considera terminado cuando usa el modelo central, sus acciones de prototipo funcionan y sus reglas/contratos quedan documentados.

## Flujo de organización validado

1. El usuario abre el diálogo desde Overview u Organizaciones.
2. Nombre y slug crean un borrador local y una membresía Owner de prototipo.
3. La ruta del onboarding incluye el ID de la organización.
4. Actividad solo produce recomendaciones; no impone capacidades.
5. El usuario elige capacidades antes de decidir si agrega una ubicación.
6. La ubicación empieza desactivada y nunca se crea implícitamente.
7. Un resumen confirma actividad, capacidades y presencia o ausencia de ubicación.
8. Al finalizar, la organización pasa de `DRAFT` a `READY`; al omitir, conserva estado pendiente y puede retomarse.

Los puntos que requieren persistencia autoritativa, permisos o transacciones están en [issues.md](./issues.md).
