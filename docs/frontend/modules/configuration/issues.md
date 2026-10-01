# Issues — Centro de configuración y ubicaciones

Pendientes reales del prototipo. Ninguno bloquea la demo; todos requieren
backend o decisiones de producto adicionales.

## Backend / persistencia

- **CRUD de ubicaciones persistente** — `locations-store` es estado en memoria.
  Requiere endpoints por organización con autorización por tenant.
- **Inventario y POS por ubicación** — las funciones declaradas ("¿Qué sucede
  aquí?") aún no condicionan los módulos dependientes: el inventario, el POS y
  los pedidos siguen operando con los mocks globales. Debe definirse el contrato
  de filtrado por ubicación operativa.
- **Asignación de ubicaciones en roles** — `team-store` usa `dashboardBranches`
  como base estática; debe consumir `locations-store` (o la misma fuente
  autoritativa) para que las ubicaciones nuevas o eliminadas se reflejen en el
  alcance de los roles del módulo Equipo.
- **Conteo de ubicaciones del plan** — el dashboard hub cuenta `branches`
  (dashboard-store) para los límites del plan (`ESSENTIAL: 1`, `GROWTH: 3`);
  debe contar ubicaciones reales y bloquear el alta al superar el límite.

## Reglas de negocio pendientes

- **Validación de funciones vs. capacidades de la organización** — hoy se
  pueden activar funciones aunque la organización no declare la capacidad
  correspondiente (p. ej. `citas` sin capacidad `clientes`).
- **Alta de ubicación con surtido** — decisión aprobada: al crear una ubicación,
  el Owner puede copiar el surtido de otra ubicación, seleccionar productos
  concretos o empezar vacío. El prototipo solo crea la ubicación vacía; falta el
  paso de surtido inicial (integración con Inventario/Catálogo).
- **Cobertura de la decisión "agregar ubicación"** — falta decidir si las
  funciones activadas generan automáticamente la presencia en canales (POS,
  web, delivery) o si eso se configura aparte.

## Permisos y seguridad

- **Enforcement en servidor** — el filtrado por permisos es solo de UI: las
  rutas de configuración responden sin validar el rol efectivo.
- **Nivel mínimo por acción** — crear/eliminar ubicaciones debería exigir
  permiso `admin` en el módulo `configuracion` (hoy solo se exige `view` para
  ver el ítem).

## Facturación (ruta reusada)

- **Consolidación futura** — `/configuracion/facturacion` y
  `/facturacion/configuracion` muestran el mismo formulario pero navegaciones
  distintas ("Regresar a facturación" vs. "Regresar"). Unificar cuando se defina
  si la configuración fiscal vive dentro del módulo o en el centro.

## Otros

- **Canales de venta en el hub** — la decisión de producto contempla que el
  Centro de configuración muestre canales conectados, disponibles y
  recomendados. Se omitió la tarjeta de Canales para no dejar un enlace a una
  ruta inexistente; se implementará con el módulo de Canales.
- **Imagen de portada de la ficha pública** — `publicProfile.coverImage` está
  en el modelo pero el formulario no la expone (pendiente de definir subida de
  archivos).
