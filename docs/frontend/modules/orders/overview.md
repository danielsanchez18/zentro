# Pedidos — Overview

**Ruta:** `/app/[slug]/pedidos`  
**Estado:** Prototipo funcional completo

## Objetivo

Permitir que el equipo identifique pedidos nuevos, atrasados o listos, y ejecute rápidamente la siguiente acción operativa.

## Componentes previstos

- [x] Header con título, exportación y acceso al Punto de venta.
- [x] KPIs: nuevos, en preparación, listos y ventas del periodo.
- [x] Búsqueda por número, cliente, teléfono o mesa.
- [x] Filtros por estado, tipo de atención, canal, pago y rango de fecha.
- [x] Ordenamiento por fecha, importe y entrega próxima.
- [x] Tabla en escritorio y cards responsive en móvil.
- [x] Preview dialog para consulta rápida sin duplicar el futuro detalle completo.
- [x] Paginación y empty state de shadcn.
- [x] Acciones funcionales para avanzar estados y cancelar pedidos.

## Información visible

- Número del pedido y hora de ingreso.
- Cliente o identificador de mesa.
- Tipo de atención y canal.
- Cantidad de productos.
- Total.
- Estado operativo y estado de pago mediante `StatusBadge`.
- Tiempo transcurrido o promesa de entrega.

## Acciones rápidas

- Ver detalle.
- Confirmar un pedido nuevo.
- Iniciar preparación.
- Marcar como listo.
- Completar entrega.
- Cancelar con confirmación y motivo.

Las acciones disponibles dependerán del estado actual; no se permitirá saltar etapas incompatibles desde el overview.
