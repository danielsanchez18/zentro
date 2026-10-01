# Workspace — Issues del módulo

## Frontend (prototipo)

- [x] Selector de contexto inferior con organización y ubicación activa (desktop)
- [x] Resolver `WorkspaceContext` mock: `src/lib/workspace/context.ts` + hook `useWorkspaceContextView(slug)`
- [x] Rol efectivo del miembro: team-store (permisos por módulo) con fallback por `roleKey` del hub
- [x] Ubicaciones permitidas según `locationScope`/`locationIds` del rol
- [x] Vista general según alcance global (`canUseGeneralView`)
- [x] Sidebar filtra grupos e ítems por permiso efectivo (`view`+) y capacidad activa
- [x] Resumen (`/app/:slug`) filtra accesos directos con el mismo contexto
- [x] Reportes reusa `canUseGeneralView` de contexto (consistencia)
- [ ] Canal activo en el contexto (mock `null` por ahora)
- [ ] Indicar en UI cuando un módulo local exige elegir ubicación antes de abrir
- [ ] Estado vacío para miembros sin módulos visibles (landing explicativo)

## Backend / Integración

- [ ] Guard de tenant real en `layout.tsx` (resolver org por slug, validar membresía, redirigir al Hub)
- [ ] Enforcement de permisos en rutas y acciones del servidor (el filtrado del sidebar es UI)
- [ ] Resolver rol/permisos desde la API en vez del mock/fallback por `roleKey`
- [ ] Contexto de canal y capacidades autoritativas (servidor)
- [ ] Auditoría de acceso al workspace (qué miembro entró, desde dónde)

## Consistencia entre módulos

- [x] Sidebar y Resumen usan el mismo `WorkspaceContext` (una sola fuente de navegación)
- [x] Reportes usa el contexto para vista general y ubicación activa
- [ ] Verificar que cada módulo respete el contexto de ubicación (POS local, Facturación global)
- [ ] Alinear `Membership.roleKey` (hub) con `TeamRole.key` (equipo) en el backend