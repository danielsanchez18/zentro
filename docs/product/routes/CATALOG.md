# Catálogo

El catálogo maestro pertenece a la organización; cada ubicación configura surtido, precio, disponibilidad y stock cuando corresponda.

## Rutas implementadas

- `/app/[slug]/catalogo` — productos y categorías, KPIs, filtros, tabla/cards y acciones.
- `/app/[slug]/catalogo/agregar-producto` — alta de producto.
- `/app/[slug]/catalogo/producto/[productId]` — información y rendimiento del producto.
- `/app/[slug]/catalogo/producto/[productId]/editar` — edición.
- `/app/[slug]/catalogo/agregar-categoria` — alta de categoría.
- `/app/[slug]/catalogo/categoria/[categoryId]` — detalle, subcategorías, productos y rendimiento.
- `/app/[slug]/catalogo/categoria/[categoryId]/editar` — edición.

**Estado:** prototipo UI/UX completo con datos locales.

## Pendientes de alineación

- Separar producto/servicio en el contrato maestro sin duplicar catálogo.
- Incorporar surtido, precio, publicación y disponibilidad por ubicación/canal.
- Aplicar permisos para crear, editar, publicar y eliminar.
- Documentar contratos de backend al iniciar integración.

