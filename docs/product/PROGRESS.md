# Progreso actual

**Última actualización:** 24 de septiembre de 2026.

## Estado general

- Landing: existente, auditoría aplazada por decisión del producto.
- Auth y recuperación: prototipo mock implementado; integración y seguridad de servidor pendientes.
- Dashboard Hub: auditado y corregido para crear organizaciones sin ubicación obligatoria.
- Layout del workspace: decisiones cerradas; selector inferior de contexto implementado.
- Catálogo: prototipo de productos y categorías completo.
- Inventario: prototipo completo.
- Compras: prototipo completo.
- Promociones: prototipo completo.
- Pedidos: prototipo completo.
- Equipo: prototipo existente; debe adaptarse al nuevo modelo Owner/Member, perfiles y alcance.
- POS: prototipo principal cerrado; cruces con Equipo/Caja, Agenda y backend documentados.
- CRM: prototipo cerrado, con CRUD, detalle, acciones rápidas y conexión con POS.
- Agenda: prototipo frontend cerrado; overview, cuatro vistas, operación, configuración y trazabilidad mock implementados.
- Formularios: prototipo frontend cerrado; flujo completo de creación, publicación, captura, revisión, historial y conversión mock.
- Caja: prototipo frontend cerrado con sesiones, movimientos, arqueo, historial, conciliación y configuración.
- Facturación: prototipo frontend cerrado. Overview con KPIs, filtros (tipo, estado, método de pago, fecha, sesión de caja) y paginación; detalle con línea de tiempo (emitido → enviado → pagado → anulado), ítems, totales, notas de crédito/débito, trazabilidad y snapshot de configuración fiscal; emisión unificada desde Pedidos que registra el comprobante en Facturación; configuración fiscal con correlativos secuenciales. Pendientes reales (PDF, correo, SUNAT, permisos) documentados en issues.md.
- Reportes, Presencia, Configuración y Auditoría: planificados, sin ruta funcional.

## Trabajo activo

- Facturación: prototipo frontend cerrado (emisión conectada a Pedidos, estados completos, notas, filtros de caja, configuración fiscal).

## Siguiente entrega

1. Conservar los contratos backend de Caja y Facturación para la etapa de integración.
2. Auditoría QA transversal (responsive, accesibilidad, estados vacíos/error).
