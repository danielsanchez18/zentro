# Equipo — Issues del módulo

Estado del prototipo frontend del módulo Equipo y permisos tras la readecuación
al modelo Owner/Member con perfiles, permisos y alcance (09/09/2026).

## Frontend

- [x] Migración de roles rígidos a entidad `TeamRole` con matriz de permisos por módulo
- [x] Perfiles de sistema (Administrador, Vendedor, Cajero, Contador, Inventario, Contenido) + Owner como titular no asignable
- [x] Tab "Roles y permisos": listado con Owner bloqueado, crear/editar/duplicar/eliminar
- [x] Matriz de permisos en el formulario de rol (niveles Sin acceso/Ver/Operar/Administrar por dominio)
- [x] Acciones sensibles configurables por rol (reembolsos, anulaciones, stock, invitaciones, roles, propiedad)
- [x] Alcance de ubicaciones por rol (todas o seleccionadas) y snapshot en invitaciones
- [x] Invitación en flujo perfil → alcance → mensaje → enviar (owner excluido)
- [x] Cambio de rol desde lista y detalle con selección de perfiles asignables
- [x] Protecciones de Owner (no deshabilitar/eliminar/cambiar rol) + auto-protección (mock de sesión)
- [x] Detalle de miembro estilo CRM: cabecera con banner/avatar/tabs, aside informativo, resumen de acceso, matriz de permisos en solo lectura y timeline de actividad
- [x] Corrección de typos ("Acesso", "Inivtado por") y limpieza de componentes muertos (MemberContactCard/FieldInfo/MemberAccessCard no renderizada)
- [x] Store Zustand (`team-store`) como fuente de datos del módulo
- [ ] Edición del perfil del miembro (datos de contacto/notas) — mock pendiente
- [ ] Transferencia de propiedad a otro miembro (acción exclusiva del Owner)
- [ ] Auditoría de permisos efectivos por ubicación (calculados, no solo snapshot del rol)

## Backend / Integración

- [ ] Endpoints reales de miembros (`GET/POST/PATCH/DELETE /teams/:id/members`)
- [ ] Entidad `Role` persistida (Prisma) con permisos por módulo y alcance; migración y seed
- [ ] Endpoint de invitaciones con expiración real, límite de miembros por plan y envío de correo
- [ ] Asignación de rol validada en servidor (Owner no asignable; permisos por capability)
- [ ] Enforcement de permisos en servidor por endpoint y por ubicación (no solo UI)
- [ ] Registro de auditoría real (quién cambió qué, cuándo, desde dónde)
- [ ] Identidad de sesión real (reemplazar mock `u1` / `CURRENT_USER_NAME`)
- [ ] Reconciliar `roleKey OWNER/ADMIN/MEMBER` de `Membership` (dashboard) con la entidad `TeamRole`

## Consistencia entre módulos

- [x] Agenda resuelve responsables desde `teamMembers` (rol/estado vigente)
- [x] Reportes filtra por ubicación activa del workspace independiente del equipo
- [ ] Sidebar del workspace debe filtrarse por permisos efectivos del miembro
- [ ] Centro de configuración debe ofrecer la misma matriz de permisos para replicar reglas
- [ ] Insignia/selector de contexto debe reflejar el alcance del miembro (ubicaciones permitidas)