# Agenda

## Estado

**Prototipo frontend y maquetación cerrados.**

La auditoría componente por componente se encuentra en [FUNCTIONAL_SPEC.md](./FUNCTIONAL_SPEC.md). Allí se documentan campos, opciones, ventajas, restricciones, stores, validaciones y diferencias entre funciones operativas y controles preparados para integración.

## Alcance entregado

- Overview con KPIs.
- Vistas día, semana, mes y lista.
- Navegación temporal, búsqueda y filtros combinables.
- Alta de cita con cliente CRM o invitado.
- Servicios, responsables, recursos y tres modalidades.
- Edición y reprogramación con motivo.
- Preview como centro de acciones.
- Estados operativos, cancelación e inasistencia.
- Historial mock.
- Adelantos y pagos parciales.
- Configuración persistente de horarios, recursos, bloqueos y parámetros.
- Validación mock de cruces por responsable o recurso.

## Frontera del cierre

“Cerrado” significa que el flujo visual y funcional esperado para el prototipo existe. No significa listo para producción:

- las citas viven en memoria y se reinician al recargar;
- la configuración persiste localmente, pero aún no gobierna las reservas;
- recurrencia y jornada completa se almacenan, pero no se materializan completamente en el calendario;
- pagos, mensajería, calendarios, permisos e historial autoritativo requieren backend/integraciones.

## Documentos

- [Especificación funcional auditada](./FUNCTIONAL_SPEC.md)
- [Reglas de negocio](./rules.md)
- [Issues pendientes](./issues.md)
- [Rutas](../../../product/routes/AGENDA.md)
