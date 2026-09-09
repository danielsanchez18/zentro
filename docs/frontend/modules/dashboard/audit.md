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

## Organizaciones/onboarding — por auditar

- Crear organización y slug.
- Configurar actividad, ubicación y capacidades.
- Abrir, configurar, copiar invitación y abandonar organización.
- Conflicto conocido: ubicación obligatoria en el wizard.

## Invitaciones — por auditar

- Pendientes, aceptar, rechazar e historial.

## Suscripciones — por auditar

- Planes, uso, facturas, detalle y descarga.

## Ayuda — por auditar

- FAQ, formulario de soporte, persistencia e historial de tickets.
