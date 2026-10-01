# Módulo Equipo y permisos

Gestión de miembros, invitaciones, perfiles de acceso (roles), matriz de permisos
por módulo, alcance de ubicaciones y detalle de cada integrante.

**Estado:** prototipo frontend cerrado (mock). Pendientes de backend en [issues.md](./issues.md).

## Rutas

| Ruta | Descripción |
|---|---|
| `/app/[slug]/equipo` | Módulo con 3 tabs: Miembros, Invitaciones, Roles y permisos |
| `/app/[slug]/equipo/[memberId]` | Detalle del integrante (estilo CRM): resumen, acceso y permisos, actividad |

## Estructura de componentes

```
src/components/app/team/
├── TeamModule.tsx            # Contenedor: tabs + store + dialog de invitación compartido
├── Title.tsx                 # Encabezado con botón "Invitar miembro"
├── KPIS.tsx                  # Cards de métricas (total, activos, pendientes, deshabilitados)
├── List.tsx                  # Tab Miembros (búsqueda, paginación, vistas tabla/cards)
├── Table.tsx                 # Vista de tabla (+ LastSeenChip reutilizable)
├── MemberCard.tsx            # Vista de cards
├── MemberActionsMenu.tsx     # Menú (⋮) con protecciones de Owner
├── MemberPreviewDialog.tsx   # Vista previa rápida del perfil
├── RoleChangeDialog.tsx      # Cambio de rol: lista perfiles asignables + roleIcon()
├── ConfirmDialog.tsx         # Diálogo de confirmación reutilizable
├── InviteMemberDialog.tsx    # Invitación en 2 pasos: perfil → alcance + mensaje
├── InvitationsSection.tsx    # Tab Invitaciones (cards con ciclo de vida + alcance)
├── roles/
│   ├── RolesSection.tsx      # Tab Roles: grid de perfiles, crear/editar/duplicar/eliminar
│   └── RoleFormDialog.tsx    # Crear/editar rol: matriz de permisos + sensibles + alcance
└── member-detail/
    ├── MemberBackLink.tsx    # Enlace "Volver a Equipo"
    ├── MemberDetailPage.tsx  # Composición del detalle (client, estilo CRM)
    ├── MemberDetailHeader.tsx# Cabecera: banner + avatar/iniciales + estado + role + tabs
    ├── MemberInfo.tsx        # Aside: información general + perfil de acceso
    ├── MemberAccessSummary.tsx# Resumen de permisos por dominio + matriz en solo lectura
    ├── MemberActivity.tsx    # Timeline de historial operativo
    └── MemberNotFound.tsx    # Estado 404

src/components/app/shared/
├── StatusBadge.tsx           # Badge reutilizable (MemberStatus + InvitationStatus + otros)
├── Search.tsx                # Buscador reutilizable
└── Paginator.tsx             # Paginador reutilizable
```

## Modelo de datos (mock)

Ubicación: `src/lib/mock/team.ts`

- **`TeamRole`** — Entidad rol/perfil: `permissions` por módulo
  (`PermissionLevel: none | view | operate | admin`), `sensitiveActions`,
  `locationScope` (`ALL | SELECTED`) y `locationIds`, `kind` (`owner | member`),
  `isSystem`, `assignable`.
- **`PermissionModuleKey`** — Catálogo de 19 módulos del workspace agrupados por
  dominio (`operacion | productos | clientes | finanzas | presencia | administracion`).
- **`SensitiveAction`** — Acciones explícitas (reembolsar, anular, ajustar stock,
  invitar, cambiar roles, transferir propiedad, eliminar organización).
- **`TeamMember`** — Miembro activo; referencia a `roleId` + snapshot `role`.
- **`MemberInvitation`** — Invitación con `roleId`, `roleName` y alcance.
- **`InvitationStatus`** — `PENDING → ACCEPTED/DECLINED/EXPIRED/REVOKED`.
- **`MemberStatus`** — `activo | invitado | deshabilitado`.
- **Roles de sistema** (`TEAM_ROLE_TEMPLATES`): Owner (no asignable), Admin,
  Vendedor, Cajero, Contador, Inventario y compras, Contenido y canales.

## Store

`src/stores/team-store.ts` (Zustand, fuente de datos del módulo):

- `members`, `invitations`, `roles`, `branches`
- `createRole`, `updateRole`, `removeRole`, `cloneRole`
- `assignRole`, `toggleMemberStatus`, `removeMember`
- `sendInvitation`, `revokeInvitation`
- Selectores: `findRoleById`, `membersByRole`

## Flujos

### Invitar miembro
1. Click "Invitar miembro" → `InviteMemberDialog` (2 pasos).
2. Paso 1: correo (validado) + **perfil sugerido** (rol asignable, Owner excluido).
3. Paso 2: **alcance** (todas las ubicaciones o selección) + mensaje opcional.
4. `sendInvitation` crea una `MemberInvitation` PENDING (expira en 7 días) y el
   tab cambia a "Invitaciones".

### Gestionar roles y permisos
1. Tab "Roles y permisos" → grid de perfiles.
2. **Crear rol** → `RoleFormDialog`: nombre, descripción, **matriz de permisos**
   (acordeón por dominio, segmentos Sin acceso/Ver/Operar/Administrar), acciones
   sensibles (switches) y alcance de ubicaciones.
3. **Editar/Duplicar** rol custom; **eliminar** solo si no tiene miembros
   asignados (`membersByRole` = 0). El Owner aparece bloqueado como "Titular".

### Cambiar rol
1. Menú (⋮) o barra flotante del detalle → `RoleChangeDialog`.
2. Lista **perfiles asignables** (nunca Owner) con descripción.
3. `assignRole` actualiza `roleId` + `role` y agrega evento al historial.

### Deshabilitar/habilitar / eliminar
1. Confirmación previa (`ConfirmDialog`); el estado se refleja en KPIs, cards,
   tabla y detalle; se registra en el historial.

## Protecciones (regla de producto 09/09/2026)

- El **Owner** no puede deshabilitarse, eliminarse ni cambiar de rol; solo
  aparece como "Titular" y sus acciones de propiedad quedan para el detalle.
- **Auto-protección** (mock: sesión = `u1` Daniel Sánchez): un miembro no puede
  deshabilitarse ni eliminarse a sí mismo.
- `MemberActionsMenu` y la barra flotante del detalle aplican ambas reglas.

## Notas de implementación

- **Click propagation**: `DropdownMenuContent` detiene la propagación para no
  abrir el preview al interactuar con el menú.
- **Iconos de rol**: `roleIcon()` en `RoleChangeDialog.tsx` resuelve el nombre
  del ícono del rol a un componente lucide (fallback `Shield`).
- **Snapshots**: `TeamMember.role` y `MemberInvitation.roleName` guardan el
  nombre en el momento del evento; el nombre vivo sale de `findRoleById`.
- **Páginas Server mínimas**: `page.tsx` resuelve params y delega a componentes
  client; los datos viven en el store, no en props de la página.