# Inventario — Movimientos / Kardex

**Ruta:** `/app/[slug]/inventario/movimientos`  
**Estado:** Prototipo funcional completo; pendiente de integración

## Objetivo

Explicar cada cambio de existencias mediante una secuencia cronológica de entradas, salidas, mermas y ajustes.

## Funcionalidades disponibles

- [x] Navegación desde Existencias.
- [x] Navegación filtrada desde “Ver historial” de un producto.
- [x] KPIs de entradas, salidas, mermas y ajustes.
- [x] Búsqueda por producto, SKU, motivo o documento.
- [x] Filtros por tipo de movimiento y producto.
- [x] Tabla responsive y vista cards.
- [x] Paginación y estado vacío.
- [x] Diferenciación visual de cantidades positivas y negativas.
- [x] Stock anterior y resultante.
- [x] Vista previa del movimiento al pulsar una fila o card.
- [x] Filtro por rango de fechas.
- [x] Ordenamiento cronológico.
- [x] Exportación CSV.
- [x] Estado compartido con Existencias mediante Zustand.

## Decisiones del prototipo

- Movimientos es una sección de consulta y auditoría.
- Las operaciones se registran desde Existencias para evitar formularios duplicados.
- El diálogo es la única vista de detalle porque contiene toda la información necesaria.

## QA pendiente

- Prueba visual manual en escritorio y teléfono.

## Pendiente de backend

- Persistencia y consulta por sucursal.
- Paginación y filtros desde servidor.
- Usuario responsable obtenido de la sesión.
- Archivos o documentos relacionados.
- Exportación real de Kardex.
- Permisos y auditoría.
