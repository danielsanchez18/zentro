# Módulo Equipo y permisos

Gestión de miembros de la organización, invitaciones y ciclo de vida de accesos.

## Rutas

| Ruta | Descripción |
|---|---|
| `/app/[slug]/equipo` | Lista de miembros + tab de invitaciones |
| `/app/[slug]/equipo/[memberId]` | Detalle de un miembro (contacto, acceso, auditoría) |

## Estructura de componentes

```
src/components/app/team/
├── TeamModule.tsx            # Contenedor principal (tabs, estado de invitaciones, dialog)
├── Title.tsx                 # Encabezado con botón "Invitar miembro"
├── KPIS.tsx                  # Cards de métricas (total, activos, pendientes, deshabilitados)
├── List.tsx                  # Tab de miembros (búsqueda, paginación, vistas tabla/cards)
├── Table.tsx                 # Vista de tabla
├── MemberCard.tsx            # Vista de cards
├── MemberActionsMenu.tsx     # Menú de acciones (⋮) — comparten tabla y cards
├── MemberPreviewDialog.tsx   # Dialog de vista previa del perfil
├── RoleChangeDialog.tsx      # Dialog para cambiar rol (cards con íconos)
├── ConfirmDialog.tsx         # Dialog de confirmación reutilizable
├── InviteMemberDialog.tsx    # Dialog para invitar nuevo miembro
├── InvitationsSection.tsx    # Tab de invitaciones (cards con ciclo de vida)
├── member-detail/
│   ├── MemberBackLink.tsx    # Enlace "Volver a Equipo"
│   ├── MemberDetailHeader.tsx# Cabecera: avatar, nombre, rol, estado
│   ├── MemberContactCard.tsx # Tarjeta de contacto
│   ├── MemberAccessCard.tsx  # Tarjeta de acceso y rol
│   ├── MemberAuditCard.tsx   # Tarjeta de historial operativo
│   ├── MemberNotFound.tsx    # Estado 404
│   └── FieldInfo.tsx         # Fila reutilizable etiqueta → valor

src/components/app/shared/
├── StatusBadge.tsx           # Badge reutilizable (MemberStatus + InvitationStatus)
├── Search.tsx                # Buscador reutilizable
└── Paginator.tsx             # Paginador reutilizable
```

## Modelo de datos (mock)

Ubicación: `src/lib/mock/team.ts`

- **`TeamMember`** — Miembro activo de la organización.
- **`MemberInvitation`** — Invitación enviada (ciclo de vida: PENDING → ACCEPTED/DECLINED/EXPIRED/REVOKED).
- **`InvitationStatus`** — Estados del ciclo de vida de invitaciones.
- **`MemberStatus`** — `activo | invitado | deshabilitado`.
- **`TeamRole`** — `Owner | Admin | Vendedor | Cajero | Contador`.

## Flujos

### Invitar miembro
1. Click "Invitar miembro" (Title) → abre `InviteMemberDialog`.
2. Valida email (regex), selecciona rol (Owner excluido), mensaje opcional.
3. Crea `MemberInvitation` con status `PENDING` en `teamInvitations`.
4. Cambia automáticamente al tab "Invitaciones".

### Reenviar invitación
1. En tab Invitaciones, click "Reenviar" en card PENDING.
2. Revoca la anterior (`REVOKED`) y crea una nueva `PENDING` con +7 días.

### Revocar invitación
1. En tab Invitaciones, click "Revocar" en card PENDING.
2. Cambia status a `REVOKED`. El badge cambia y se quitan los botones.

### Cambiar rol
1. Menú de acciones → "Cambiar rol" → abre `RoleChangeDialog`.
2. Selección visual por cards con ícono y descripción del rol.
3. Confirma → actualiza el miembro en el estado.

### Deshabilitar/habilitar acceso
1. Menú de acciones → "Deshabilitar acceso" → abre `ConfirmDialog`.
2. Confirma → cambia status a `deshabilitado` o `activo`.

### Eliminar miembro
1. Menú de acciones → "Eliminar de la empresa" → abre `ConfirmDialog`.
2. Confirma → elimina el miembro del array.

## Notas de implementación

- **Click propagation**: `DropdownMenuContent` tiene `onClick={(e) => e.stopPropagation()}` para evitar que clicks en el menú abran el preview del miembro.
- **Componentes compartidos**: `StatusBadge` soporta tanto `MemberStatus` como `InvitationStatus` (reutilizable en otros módulos).
- **Separación de concerns**: Las páginas (`page.tsx`) son Server Components mínimos. Toda la UI vive en componentes `client` bajo `src/components/app/team/`.
