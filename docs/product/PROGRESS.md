# Progreso actual

**Última actualización:** 9 de septiembre de 2026.

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
- POS: prototipo funcional completo; integración pendiente.
- CRM, Agenda, Formularios, Finanzas, Presencia, Configuración y Auditoría: planificados, sin ruta funcional.

## Trabajo activo

**Workspace dinámico — fase 2:** convertir la navegación estática en navegación derivada de capacidades, permisos y contexto de ubicación.

## Siguiente entrega

1. Crear el contrato mock de `WorkspaceContext`.
2. Incorporar capacidades activas, permisos efectivos y ubicaciones permitidas.
3. Filtrar el sidebar mediante ese contrato.
4. Probar Owner, Member global, Member de una ubicación y negocio sin ubicaciones.
5. Después, alinear Equipo y permisos con el nuevo WorkspaceContext.
