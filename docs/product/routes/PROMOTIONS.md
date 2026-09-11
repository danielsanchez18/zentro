# Promociones

## Rutas

- `/app/[slug]/promociones` — KPIs, filtros, previews y acciones.
- `/app/[slug]/promociones/agregar` — configuración de beneficio, vigencia, alcance y uso.
- `/app/[slug]/promociones/[promotionId]` — detalle, productos/categorías y rendimiento.
- `/app/[slug]/promociones/[promotionId]/editar` — edición.

**Estado:** prototipo UI/UX completo.

## Alineación aprobada

- Es un módulo híbrido, no exclusivamente de la sucursal activa.
- Una promoción puede evolucionar a alcance general, por ubicación o por canal.
- Vigencia, estado, límites de uso y rendimiento se mantienen separados.

## Issues pendientes

- Evaluación autoritativa de elegibilidad, prioridad y conflictos.
- Contadores de uso transaccionales.
- Segmentación por cliente, canal y ubicación.
- Integración con POS, Web, Marketplace y Pedidos.

Documentación detallada: [Promociones](../../frontend/modules/promotions/README.md).

