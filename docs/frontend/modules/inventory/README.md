# Inventario

**Estado del módulo:** Prototipo funcional cerrado; pendiente de QA e integración con backend.

## Objetivo

Controlar las existencias de una sucursal activa. La selección de sucursal pertenece al layout de la aplicación y no forma parte de este módulo.

## Alcance funcional

| Sección | Ruta propuesta | Estado |
|---|---|---|
| Overview | `/app/[slug]/inventario` | Prototipo funcional completo |
| Movimientos / Kardex | `/app/[slug]/inventario/movimientos` | Prototipo funcional completo |
| Detalle de existencia | Diálogo desde el overview | Incluido en el prototipo |
| Proveedores | `/app/[slug]/inventario/proveedores` | Prototipo funcional completo |
| Marcas | `/app/[slug]/inventario/marcas` | Prototipo funcional completo |
| Conteos físicos | Sin ruta definida | Expansión futura |

## Cierre del prototipo

1. Overview y operaciones de stock. ✓
2. Movimientos / Kardex y diálogo de detalle. ✓
3. Overview y CRUD de proveedores. ✓
4. Overview y CRUD de marcas. ✓
5. Consulta de la existencia desde el diálogo del overview. ✓

El prototipo se considera cerrado porque los flujos visibles del alcance acordado funcionan con estado local y datos mock. Esto no implica que el módulo esté listo para producción: aún requiere QA, contratos de API, persistencia, permisos y reglas de concurrencia.

## Decisiones de alcance

- La selección de sucursal se resuelve fuera del módulo de Inventario.
- No se crea una ruta individual de existencia: el diálogo del overview concentra el resumen, las acciones y el acceso al historial.
- Los conteos físicos y la conciliación formal se reservan para una expansión posterior.
- La administración avanzada de relaciones proveedor–producto se abordará junto con compras o con la integración de backend.

## Organización de componentes

```text
components/app/inventory/
├── overview/
├── movements/
│   ├── overview/
│   ├── details/
│   └── shared/
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
- [Proveedores](./suppliers.md)
- [Marcas](./brands.md)
- [Pendientes e issues](./issues.md)
- `counts.md` — se creará si Conteos físicos entra en un alcance futuro.
- `backend-contract.md` — se completará antes de la integración.
