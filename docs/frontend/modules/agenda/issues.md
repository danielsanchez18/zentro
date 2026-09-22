# Agenda — issues pendientes

Estos issues no reabren la maquetación principal; delimitan la diferencia entre el prototipo cerrado y una implementación integrada.

## Frontend e integración mock

- [ ] Usar `useAgendaSettingsStore.resources` en crear/editar en lugar de `agendaResources` estático.
- [ ] Aplicar horario semanal, bloqueos, buffer y antelación al validar disponibilidad.
- [ ] Renderizar citas `allDay` en la fila “Todo el día”.
- [ ] Materializar recurrencias o representar claramente que se trata de una regla sin serie generada.
- [ ] Calcular KPIs usando la fecha actual/activa en lugar de `2026-09-12`.
- [ ] Persistir el store mock de citas si se necesita conservar pruebas tras recargar.
- [ ] Añadir filtro de ubicación cuando haya varias ubicaciones.
- [ ] Incorporar capacidad grupal.
- [ ] Validar dirección obligatoria para domicilio y contacto/enlace para online.
- [ ] Eliminar el componente legado no conectado `overview/AgendaSettingsDialog.tsx`.
- [ ] Retirar menús ocultos y props de transición residuales en tarjetas/vistas.
- [ ] Limpiar warnings de imports e imágenes sin optimizar.
- [ ] Ejecutar QA visual manual móvil y accesibilidad.

## Backend

- [ ] Persistir citas, servicios reservables, horarios, excepciones, recursos y bloqueos por organización/ubicación.
- [ ] Implementar disponibilidad y detección transaccional de conflictos.
- [ ] Normalizar timezone, UTC y fechas autoritativas.
- [ ] Implementar recurrencia, series y edición de ocurrencia/serie.
- [ ] Mantener historial append-only con actor real.
- [ ] Aplicar permisos y alcance.
- [ ] Implementar recordatorios, confirmaciones y enlaces seguros.
- [ ] Proteger transiciones de estado y eliminación en servidor.

## Integraciones

- [ ] Usar identidad autoritativa de CRM y conservar snapshot.
- [ ] Obtener responsables reservables desde Equipo y permisos.
- [ ] Unificar servicios y recursos con sus fuentes maestras.
- [ ] Conectar pagos, saldos y devoluciones con Pedidos, POS y Caja.
- [ ] Registrar método, caja, terminal y cobrador.
- [ ] Crear enlaces de videollamada mediante proveedor configurable.
- [ ] Sincronizar calendarios externos evitando duplicados.
- [ ] Publicar disponibilidad en Web, Marketplace y Formularios.
- [ ] Enviar WhatsApp/correo y registrar entrega/error.
