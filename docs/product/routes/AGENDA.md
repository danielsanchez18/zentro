# Rutas — Agenda

## /app/[slug]/agenda

Ruta operativa implementada.

Contiene:

- KPIs;
- vistas día, semana, mes y lista;
- navegación por fecha;
- búsqueda y filtros;
- creación en diálogo;
- preview y acciones;
- edición/reprogramación;
- pagos parciales;
- historial mock.

No se crea una ruta `/agenda/agregar` porque el alta cabe en un diálogo y forma parte del flujo rápido del calendario.

No se crea una ruta `/agenda/[appointmentId]` en el prototipo porque el preview concentra detalle y operación. Podrá añadirse si el historial o las integraciones futuras requieren una página profunda.

## /app/[slug]/agenda/configuracion

Ruta implementada y persistida localmente.

Secciones:

- horario semanal;
- recursos reservables;
- bloqueos y excepciones;
- parámetros de reserva y notificaciones.

## Estado

Rutas del prototipo cerradas. La especificación detallada y las restricciones están en [Agenda](../../frontend/modules/agenda/FUNCTIONAL_SPEC.md).
