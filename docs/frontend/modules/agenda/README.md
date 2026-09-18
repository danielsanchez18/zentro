# Agenda

## Objetivo

Agenda centraliza citas, reservas y disponibilidad para organizaciones de servicios o negocios mixtos. Es una capacidad opcional: una organización puede operar sin Agenda y Agenda puede operar sin Inventario o sin ubicaciones.

## Funcionalidades implementadas

### Overview y calendario

- KPIs de citas de hoy, pendientes de confirmación, ocupación y no asistencia.
- Vistas diaria, semanal, mensual y listado.
- Navegación anterior/siguiente, acceso a hoy y selector de fecha con Calendar de shadcn.
- Búsqueda por cliente, servicio, responsable o número de cita.
- Filtro por estado.
- Grillas horarias con resolución visual de cruces, fila de todo el día e indicador de hora.
- Estado vacío reutilizable en el listado.

### Crear cita

El diálogo permite configurar:

- título o servicio del catálogo;
- fecha y hora de inicio y fin, con opción de todo el día;
- repetición diaria, semanal, mensual o anual;
- cliente existente de CRM o invitado con nombre, teléfono y correo;
- responsable de Equipo o cita sin asignar;
- modalidad presencial, a domicilio u online;
- ubicación, dirección o enlace de videollamada según modalidad;
- permisos de participantes, notificación por correo, notas y recordatorio.

En el mock actual se persisten cliente/invitado, servicio o título como `serviceName`, responsable, modalidad, fechas, contacto, ubicación, enlace, notas, precio y estado inicial. Todo el día, recurrencia, permisos, preferencias de notificación y recordatorios todavía son controles visuales y no forman parte del contrato `Appointment`.

### Preview y operación

- Preview con estado, código, modalidad, fecha, horario y duración.
- Datos y accesos de contacto por WhatsApp, correo y teléfono.
- Responsable, ubicación/dirección o acceso y copia de enlace online.
- Resumen de pago con importe abonado, total y progreso.
- Notas y copia de un resumen compartible.
- Transiciones desde tarjetas y calendario: confirmar, iniciar, completar, cancelar y marcar no asistencia.

## Operación completada en el prototipo

- El preview concentra las acciones; las tarjetas del calendario solo abren el detalle.
- Edición y reprogramación conectadas a `updateAppointment`, con motivo obligatorio cuando cambia el horario.
- Historial mock de creación, actualización, reprogramación, estados y pagos.
- Cancelación y no asistencia con motivo; eliminación restringida para citas iniciadas, completadas o con pagos.
- Adelantos y pagos parciales hasta completar el total.
- Persistencia mock de todo el día, recurrencia, permisos, recordatorios y notificaciones.
- Configuración visual de horarios, recursos y bloqueos.
- Selección de recurso y detección de cruces por responsable o recurso.
- Filtros por estado, servicio, responsable y modalidad.
- Navegación de fecha restaurada e indicador basado en la hora actual.

## Decisiones cerradas

1. Agenda es opcional y se activa por capacidad, no rígidamente por rubro.
2. Los servicios pertenecen al catálogo maestro; Agenda añade duración, preparación y reglas de reserva.
3. Una cita no exige ubicación: online y ciertos servicios móviles pueden operar a nivel organización.
4. Los responsables provienen de Equipo y requieren permiso/capacidad para ser reservables.
5. Los clientes provienen de CRM, pero puede capturarse un invitado sin crear perfil automáticamente.
6. Abrir una cita no obliga a cobrar ni a crear un pedido.
7. Toda reprogramación, reasignación, cancelación y cambio de estado conservará historial.
8. La disponibilidad se calcula; no se edita como un estado aislado.

## Progreso verificado

- [x] Planeamiento, reglas, rutas e issues.
- [x] Contrato mock base de servicios, recursos y citas.
- [x] Overview con KPIs y vistas día, semana, mes y lista.
- [x] Navegación por fecha, búsqueda y filtro de estado.
- [x] Alta mock con cliente CRM o invitado, servicio/título, responsable, modalidad, fechas y notas.
- [x] Preview enriquecido, contacto, pago, enlace online y resumen compartible.
- [x] Transiciones operativas básicas.
- [x] Edición, reprogramación e historial.
- [x] Configuración mock de disponibilidad, recursos y bloqueos.
- [x] Persistencia de controles avanzados del diálogo.
- [x] Adelantos, pagos parciales y protección de eliminación.
- [x] Validación TypeScript y build de producción.

## Estado

**Prototipo frontend cerrado.** Los flujos principales de Agenda están maquetados y funcionan con estado mock. La persistencia autoritativa, calendarios externos, mensajería, permisos reales y transacciones financieras permanecen como trabajo de backend/integración.

Ver [reglas](./rules.md) e [issues](./issues.md).
