# Agenda

## Objetivo

Agenda centraliza citas, reservas y disponibilidad para organizaciones de servicios o negocios mixtos. Es una capacidad opcional: una organización puede operar sin Agenda y Agenda puede operar sin Inventario o sin ubicaciones.

## Alcance funcional

### Overview

- KPIs de citas de hoy, pendientes de confirmación, ocupación y no asistencia.
- Vistas diaria, semanal y listado.
- Navegación de fechas y acceso rápido a hoy.
- Filtros por estado, servicio, responsable, modalidad y ubicación.
- Búsqueda por cliente, servicio o responsable.
- Creación rápida de cita y bloqueo de horario.

### Citas

- Alta, edición, detalle, confirmación, inicio, finalización, cancelación y no-show.
- Cliente registrado de CRM o datos de contacto capturados para invitado.
- Uno o varios servicios, con duración y precio capturados como snapshot.
- Responsable opcional inicialmente y asignable después.
- Modalidad presencial, a domicilio u online.
- Ubicación requerida solo cuando la modalidad y configuración lo necesiten.
- Recursos opcionales: cabina, sala, silla, equipo u otro recurso reservable.
- Notas internas, indicaciones al cliente y origen de la reserva.
- Historial de cambios y reprogramaciones.

### Disponibilidad

- Horario general y excepciones.
- Disponibilidad por responsable, ubicación, servicio y recurso.
- Bloqueos por descanso, mantenimiento, ausencia o evento interno.
- Prevención de cruces sobre el mismo responsable o recurso.
- Capacidad concurrente configurable para servicios grupales.

### Cobros

- Una cita puede existir sin pedido ni pago.
- Puede registrar adelanto, pago parcial o pago total mediante Pedidos/POS.
- Agenda muestra estado de pago, pero Caja será la fuente financiera.
- Cancelaciones y no-show conservarán historial y aplicarán la política configurada.

## Decisiones cerradas

1. Agenda es opcional y se activa por capacidad, no rígidamente por rubro.
2. Los servicios pertenecen al catálogo maestro; Agenda añade duración, preparación y reglas de reserva.
3. Una cita no exige ubicación: online y ciertos servicios móviles pueden operar a nivel organización.
4. Los responsables provienen de Equipo y requieren permiso/capacidad para ser reservables.
5. Los clientes provienen de CRM, pero puede capturarse un invitado sin crear perfil automáticamente.
6. Abrir una cita no obliga a cobrar ni a crear un pedido.
7. Toda reprogramación, reasignación, cancelación y cambio de estado conserva historial.
8. La disponibilidad se calcula; no se edita como un estado aislado.

## Orden de desarrollo

1. Contrato mock, reglas y overview.
2. Alta/edición de citas.
3. Detalle e historial.
4. Configuración de servicios y disponibilidad.
5. Gestión de recursos y bloqueos.
6. Integración mock con CRM, Equipo, Pedidos y POS.
7. QA responsive y documentación de cierre.

## Progreso

- [x] Planeamiento, reglas, rutas e issues.
- [x] Contrato mock de servicios, recursos y citas.
- [x] Overview con KPIs y vistas día, semana y lista.
- [x] Navegación por fecha, búsqueda y filtro de estado.
- [x] Creación rápida con cliente CRM o invitado, servicio, responsable opcional, modalidad y fecha.
- [x] Vista previa y transiciones operativas básicas.
- [ ] Formularios completos de alta y edición.
- [ ] Página de detalle e historial.
- [ ] Configuración de disponibilidad, recursos y bloqueos.
- [ ] Integraciones mock restantes y QA de cierre.

Ver [reglas](./rules.md) e [issues](./issues.md).
