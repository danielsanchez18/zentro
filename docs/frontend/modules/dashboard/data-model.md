# Dashboard — Contrato de datos

El modelo local representa el contrato objetivo entre frontend y backend. Las entidades normalizadas usan IDs y las pantallas reciben proyecciones derivadas.

## Entidades

- `DashboardUser`: identidad personal, contacto, estado y preferencias regionales.
- `UserIdentity`: método de acceso Password, Google, Facebook o Apple vinculado al usuario.
- `UserSession`: sesión revocable con dispositivo, navegador, actividad y ubicación aproximada.
- `NotificationPreference`: preferencia por evento y canal; distingue avisos obligatorios.
- `DashboardOrganization`: tenant; no contiene al usuario ni requiere sucursal.
- `Membership`: relación usuario-organización con rol y estado.
- `OrganizationBranch`: ubicación opcional de una organización.
- `OrganizationInvitation`: invitación dirigida a un correo y vinculada a organización, invitador y rol.
- `PlanDefinition`: definición comercial provisional y límites.
- `OrganizationSubscription`: suscripción de una organización a un plan.
- `OnboardingProgress`: progreso personal/configuracional explícito.

## Proyecciones para UI

Las vistas pueden recibir modelos como `DashboardOrganizationSummary`, pero estos se construyen en selectores combinando organización, membresía, suscripción y sucursales. No se almacenan como una segunda fuente de verdad.

## Convenciones para backend

- IDs opacos y estables; la UI no deduce tipo o permiso desde el prefijo.
- Estados son enums en mayúsculas.
- Dinero se transporta en unidades menores más `currencyCode`, no como texto formateado.
- Fechas se transportan en ISO 8601 UTC; textos como “hace 1 día” se calculan en presentación.
- Campos ausentes semánticamente son `null`; no se sustituyen con cadenas vacías.
- Relaciones se expresan con IDs. Los nombres duplicados solo se permiten como snapshots históricos justificados.
- Respuestas de listado deben poder paginarse aunque el prototipo use arrays pequeños.

## Contratos previstos

- `GET /me`
- `PATCH /me`
- `GET /me/identities`
- `DELETE /me/identities/:identityId`
- `GET /me/sessions`
- `DELETE /me/sessions/:sessionId`
- `GET/PATCH /me/notification-preferences`
- `GET /me/memberships?include=organization,subscription`
- `GET /me/invitations`
- `GET /me/subscriptions`
- `GET /me/invoices`
- `GET/PUT /me/onboarding`

Los nombres finales pueden cambiar al diseñar la API, pero las fronteras y relaciones deben conservarse.
