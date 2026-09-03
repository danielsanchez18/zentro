# Inventario

## Objetivo

Controlar las existencias de una sucursal activa. La selección de sucursal pertenece al layout de la aplicación y no forma parte de este módulo.

## Alcance funcional

| Sección | Ruta propuesta | Estado |
|---|---|---|
| Overview | `/app/[slug]/inventario` | Prototipo en desarrollo |
| Movimientos / Kardex | `/app/[slug]/inventario/movimientos` | Prototipo en desarrollo |
| Detalle de existencia | `/app/[slug]/inventario/productos/[inventoryId]` | Planeado |
| Proveedores | `/app/[slug]/inventario/proveedores` | Planeado |
| Marcas | `/app/[slug]/inventario/marcas` | Planeado |
| Conteos físicos | `/app/[slug]/inventario/conteos` | Futuro |

## Orden de implementación

1. Cerrar el prototipo funcional del overview.
2. Diseñar Movimientos / Kardex y el detalle del movimiento.
3. Diseñar el detalle de existencia por producto.
4. Construir el CRUD de proveedores.
5. Construir el CRUD de marcas.
6. Diseñar conteos físicos y conciliación de diferencias.
7. Definir contratos e integración con backend.

## Organización de componentes

```text
components/app/inventory/
├── overview/
├── movements/
│   ├── overview/
│   ├── details/
│   └── shared/
├── products/details/
├── suppliers/
│   ├── overview/
│   ├── add/
│   ├── edit/
│   ├── details/
│   └── shared/
├── brands/
│   ├── overview/
│   ├── add/
│   ├── edit/
│   ├── details/
│   └── shared/
├── counts/
└── shared/
```

## Estados usados en la documentación

- **Planeado:** funcionalidad definida, todavía sin interfaz.
- **Prototipo:** interfaz y comportamiento local con datos mock.
- **Integrado:** conectado a servicios o API.
- **Terminado:** integrado, validado y probado.

## Documentos

- [Overview](./overview.md)
- [Movimientos / Kardex](./movements.md)
- `products.md` — se completará al iniciar el detalle de existencia.
- `suppliers.md` — se completará al iniciar Proveedores.
- `brands.md` — se completará al iniciar Marcas.
- `counts.md` — se completará al iniciar Conteos.
- `backend-contract.md` — se completará antes de la integración.
