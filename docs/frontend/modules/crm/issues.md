# CRM — issues de backend e integración

## Backend

- [ ] Persistir clientes por organización y aplicar aislamiento multi-tenant.
- [ ] Generar y usar customerId en pedidos, pagos, citas, formularios y conversaciones.
- [ ] Definir normalización y unicidad autoritativa de correo, teléfono y documento.
- [ ] Implementar búsqueda, filtros, ordenamiento y paginación del lado del servidor.
- [ ] Resolver duplicados y ofrecer fusión de perfiles con auditoría.
- [ ] Convertir eliminación en archivado o anonimización segura cuando exista historial.
- [ ] Mantener historial append-only con actor, origen, fecha y cambios relevantes.
- [ ] Aplicar permisos por módulo, acción y alcance organizacional/ubicación.

## Privacidad y canales

- [ ] Registrar consentimientos, preferencias de contacto y revocación por canal.
- [ ] Definir retención y exportación de datos personales.
- [ ] Validar direcciones y soportar múltiples direcciones con una principal.
- [ ] Importar/exportar clientes con previsualización, validación y reporte de errores.

## Integraciones futuras

- [ ] Sincronizar métricas a partir de pedidos reales, sin valores acumulados editables.
- [ ] Conectar CRM con Agenda, Formularios, WhatsApp y automatizaciones.
- [ ] Añadir segmentos dinámicos y filtros guardados cuando exista el motor de audiencias.
