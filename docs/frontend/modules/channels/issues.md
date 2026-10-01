# Pendientes — Módulo Canales de venta

## 1. Conectores de integraciones externas (el pendiente grande)

Lo que hoy es una tarjeta deshabilitada. Por plataforma falta:

1. **OAuth / autorización** de la cuenta externa y almacenamiento de tokens
   (nunca en el frontend; el backend los refresca).
2. **Sincronización de catálogo**: mapeo de productos de la plataforma a
   `products` del catálogo, con política de conflicto (qué gana si difieren
   precios).
3. **Recepción de pedidos**: webhook o polling, con normalización al modelo de
   Pedidos (cliente, dirección, método de pago, estado).
4. **Reconciliación de pagos**: `IntegrationCapability.pagos` implica que la
   plataforma es la fuente autoritativa del pago; hay que decidir si se refleja
   en Caja y cómo se evitan dobles.
5. **Inventario**: si la plataforma descuenta stock, decidir cuál es la fuente de
   verdad para evitar sobreventa.
6. **UI de conexión**: reemplazar `available: false` por el flujo real de
   autorizar, mostrar `desconectado → conectando → conectado | error`, y permitir
   desconectar y re-sincronizar.

## 2. Migrar las tres unions legacy

La entidad ya existe y `orderChannelLabel` resuelve contra ella, pero los datos
siguen guardando la clave legacy:

- `OrderChannel` (`orders.ts`) → debería referenciar `channelId` + snapshot del
  origen (`kind`, `platform`).
- `CustomerChannel` (`crm.ts`) → el "canal preferido" debería apuntar al canal.
- `FormChannel` (`forms.ts`) → `enlace` e `interno` **no son canales de venta**
  (son captación y registro interno). Decidir si se mantienen aparte o se
  modelan como otro tipo de origen. `resolveLegacyChannel` ya devuelve `null`
  para ellos.

Mientras tanto, `resolveLegacyChannel` en `channels-store` es el puente.

## 3. Contexto de canal activo

Pendiente desde la tarea 7 del roadmap. Hoy el selector del sidebar es
ubicación + "Vista general"; el canal sería la tercera dimensión. Requiere
decidir si el canal activo filtra pedidos/KPIs y cómo se combina con el alcance
de ubicaciones.

## 4. Sin guard de servidor

El bloqueo de `/app/:slug/canales` es solo de UI (`view.canViewModule`). Al
conectar la API, el endpoint debe validar el permiso `canales` por rol.

## 5. Sin persistencia

Todo vive en memoria Zustand. Los canales propias por organización y las
conexiones externas necesitan persistencia autoritativa.

## 6. En el modelo de permisos

`canales` se agregó como clave nueva. Falta decidir si se mantiene así o si
eventualmente `canales` absorbe a `marketplace` (hoy son módulos separados, y
la decisión actual es mantenerlos separados a propósito).