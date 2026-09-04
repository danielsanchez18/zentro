# Inventario — Marcas

**Ruta:** `/app/[slug]/inventario/marcas`  
**Estado:** Prototipo funcional cerrado; pendiente de QA e integración

## Objetivo

Organizar las marcas de los productos de la sucursal activa y resumir su participación en existencias y valorización.

## Funcionalidades disponibles

- [x] Navegación desde Inventario.
- [x] KPIs de marcas registradas, activas, productos y valorización.
- [x] Búsqueda por nombre, descripción u origen.
- [x] Filtros por estado y origen.
- [x] Vista tabla y cards responsive.
- [x] Paginación y estado vacío.
- [x] Estados mediante `StatusBadge`.
- [x] Alta mediante formulario reutilizable dentro de un diálogo.
- [x] Validación de nombre duplicado, descripción y país de origen.
- [x] Estado local compartido y actualización inmediata del overview.
- [x] Edición mediante modal y formulario reutilizable.
- [x] Detalle con métricas y productos relacionados.
- [x] Activación, desactivación y eliminación local con confirmación.
- [x] Métricas calculadas desde las existencias del prototipo.
- [x] Menú de acciones en tabla y cards.
- [x] Acceso directo a detalle, edición, cambio de estado y eliminación desde el overview.

## Organización

```text
inventory/brands/overview/
├── BrandsModule.tsx
├── BrandsHeader.tsx
├── BrandsKpis.tsx
├── BrandsList.tsx
├── BrandsTable.tsx
├── BrandActionsMenu.tsx
└── BrandCard.tsx

inventory/brands/
├── add/AddBrandDialog.tsx
├── details/
│   ├── BrandDetailPage.tsx
│   ├── BrandInfo.tsx
│   └── BrandProducts.tsx
├── edit/EditBrandDialog.tsx
└── shared/
    └── BrandForm.tsx
```

Los pendientes de integración se registran en [issues.md](./issues.md).
