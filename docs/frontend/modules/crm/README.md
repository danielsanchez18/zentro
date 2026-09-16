# CRM

## Alcance del prototipo

CRM es la fuente única de clientes del workspace. Sus perfiles se reutilizan en POS, pedidos y, más adelante, Agenda, Formularios y canales de venta.

### Implementado

- Overview con KPIs, búsqueda por nombre/correo/teléfono/documento y filtros por estado/tipo.
- Alternancia entre tabla y tarjetas, paginación y empty state compartido.
- Alta y edición con formulario seccionado y selects de shadcn.
- Perfil para personas o empresas, documento, contacto, estado, canal preferido, etiquetas y notas.
- Dirección principal estructurada para autocompletar delivery.
- Detalle con información, métricas, direcciones, pedidos relacionados e historial.
- Acciones rápidas funcionales en tabla y tarjetas para ver, editar, habilitar/deshabilitar y eliminar.
- Toast flotante del detalle alineado con la paleta común: edición verde, cambio de estado neutro y eliminación roja.
- POS consulta los clientes activos del store de CRM; ya no mantiene una lista paralela.

## Reglas del prototipo

- El nombre y teléfono son obligatorios; el correo es opcional, pero debe ser válido y único cuando exista.
- Un documento informado debe tener entre 8 y 11 dígitos.
- Un cliente inactivo conserva historial, pero no aparece en la búsqueda de POS.
- La dirección principal alimenta automáticamente el formulario de delivery.
- Los pedidos se relacionan temporalmente por correo, teléfono o nombre; el backend deberá usar customerId.
- Eliminar un perfil no elimina pedidos existentes. En producción deberá preferirse archivado/anonimización según política.

## Contrato

- Datos: src/lib/mock/crm.ts
- Estado CRUD: src/stores/crm-store.ts
- UI: src/components/app/crm/
- Consumidor compartido: src/components/app/pos/cart/CustomerSearchDialog.tsx

Ver [issues pendientes](./issues.md).

## Estado del módulo

**Cerrado como prototipo frontend.** Los puntos abiertos de `issues.md` requieren backend, integraciones o decisiones posteriores y no bloquean el cierre de maquetación.
