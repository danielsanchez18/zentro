# Agenda — issues pendientes

## Frontend no bloqueante

- [ ] Centralizar la configuración visual de horarios, recursos y bloqueos en un store persistente cuando se defina su contrato final.
- [ ] Añadir filtro de ubicación cuando exista más de una ubicación mock activa en Agenda.
- [ ] Sustituir imágenes `img` por el componente optimizado del proyecto y limpiar warnings de imports heredados.
- [ ] Ejecutar QA visual manual en dispositivos móviles antes de integración.

## Backend

- [ ] Persistir citas, servicios reservables, horarios, excepciones, recursos y bloqueos por organización.
- [ ] Implementar detección transaccional de conflictos y capacidad concurrente.
- [ ] Normalizar timezone, cambios de horario y fechas autoritativas.
- [ ] Implementar recurrencia, series y edición de una ocurrencia o serie completa.
- [ ] Mantener historial append-only de estados, reprogramaciones y asignaciones.
- [ ] Aplicar permisos y alcance por organización/ubicación.
- [ ] Implementar recordatorios, confirmaciones y enlaces seguros.

## Integraciones

- [ ] Usar `customerId` autoritativo de CRM y permitir invitado sin alta automática.
- [ ] Obtener responsables reservables desde Equipo y sus permisos.
- [ ] Unificar servicios con el catálogo maestro y snapshots por cita.
- [ ] Conectar adelantos, saldos y devoluciones con Pedidos, POS y Caja.
- [ ] Crear enlaces de videollamada mediante proveedor configurable.
- [ ] Sincronizar calendarios externos evitando duplicados.
- [ ] Integrar disponibilidad pública con Web, Marketplace y Formularios.
