# Inventario — Proveedores

**Ruta:** `/app/[slug]/inventario/proveedores`  
**Estado:** Prototipo funcional cerrado; pendiente de QA e integración

## Objetivo

Centralizar los terceros que abastecen a la sucursal activa y ofrecer una lectura rápida de contactos, productos vinculados, tiempos de entrega y condiciones de pago.

## Funcionalidades disponibles

- [x] Navegación desde las secciones de Inventario.
- [x] KPIs de proveedores activos, productos vinculados, tiempo de entrega y entradas del mes.
- [x] Búsqueda por razón social, nombre comercial, RUC, contacto o correo.
- [x] Filtros por estado y tiempo de entrega.
- [x] Vista tabla y cards responsive.
- [x] Paginación y estado vacío.
- [x] Estado visual mediante `StatusBadge` compartido.
- [x] Navegación al detalle al pulsar una fila o card.
- [x] Alta de proveedor con formulario reutilizable.
- [x] Validación de campos requeridos, correo, plazo y RUC duplicado.
- [x] Registro en el store local y actualización inmediata del overview.
- [x] Acciones de formulario mediante el Toast flotante compartido.
- [x] Detalle con información, condiciones, productos y entradas recientes.
- [x] Edición mediante el formulario reutilizable.
- [x] Activación y desactivación desde las acciones flotantes.
- [x] Eliminación local con confirmación.

## Decisiones de alcance

- Los productos suministrados y las entradas recientes se muestran como información contextual del prototipo.
- La edición avanzada de la relación proveedor–producto queda como expansión futura y se definirá con el módulo de compras o el contrato de backend.
- El historial comercial persistido pertenece a la etapa de integración y no bloquea el cierre visual del prototipo.

## Datos del prototipo

Los registros viven en `src/lib/mock/inventory-suppliers.ts`. Las métricas son demostrativas y no se persisten.

## Organización

```text
inventory/suppliers/overview/
├── SuppliersModule.tsx
├── SuppliersHeader.tsx
├── SuppliersKpis.tsx
├── SuppliersList.tsx
├── SuppliersTable.tsx
└── SupplierCard.tsx

inventory/suppliers/
├── add/AddSupplierPage.tsx
├── details/
│   ├── SupplierDetailPage.tsx
│   ├── SupplierDetailHeader.tsx
│   ├── SupplierInfo.tsx
│   ├── SupplierCommercialTerms.tsx
│   ├── SupplierProducts.tsx
│   └── SupplierRecentActivity.tsx
├── edit/EditSupplierPage.tsx
└── shared/
    ├── SupplierForm.tsx
    ├── SupplierFormSection.tsx
    ├── SupplierGeneralInfo.tsx
    ├── SupplierContactInfo.tsx
    └── SupplierCommercialInfo.tsx
```

Los pendientes técnicos y funcionales se mantienen en [issues.md](./issues.md).
