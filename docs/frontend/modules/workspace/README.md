# Workspace de organización — layout y contexto

> Decisión de producto aprobada el 09/09/2026.

## Principio base

`/app/[slug]` utiliza un único layout adaptable. La organización es siempre el contexto raíz; una ubicación operativa es opcional y nunca representa por sí sola otro tenant o ecommerce.

El layout se construirá desde un `WorkspaceContext` compuesto por:

- organización actual;
- membresía y roles del usuario;
- permisos efectivos;
- capacidades activadas por la organización;
- ubicaciones a las que el usuario tiene acceso;
- ubicación operativa activa, que puede ser `null`;
- canal activo cuando una pantalla necesite contexto de canal.

## Entrada adaptativa

Al entrar al workspace:

1. **Sin ubicaciones:** se abre el contexto general y no aparece selector de ubicación.
2. **Acceso a una sola ubicación:** se selecciona directamente; el usuario ve el contexto pero no un selector innecesario.
3. **Acceso a varias ubicaciones:** se recupera la última ubicación válida utilizada y se permite cambiarla.
4. **Acceso global:** se ofrece además “Todas las ubicaciones” para módulos compatibles.
5. **Contexto inválido o revocado:** se elige una ubicación permitida o se vuelve al contexto general.
6. **POS y otros módulos estrictamente locales:** requieren una ubicación concreta y no aceptan “Todas”.

La última selección mejora la experiencia, pero nunca concede acceso: debe validarse contra las asignaciones vigentes del miembro.

### Selector inferior del sidebar

El footer muestra siempre la organización y el contexto operativo actual. Al abrirlo:

- ofrece “Vista general” únicamente a miembros con alcance global;
- lista solo las ubicaciones permitidas;
- permite acceder a la configuración del negocio;
- permite volver al Hub para cambiar de organización.

Si el miembro solo puede trabajar en una ubicación, esta se selecciona automáticamente y no se ofrece “Vista general”. La selección mock se conserva por organización en almacenamiento local; sigue siendo estado de interfaz y no una fuente de autorización.

**Estado del prototipo:** selector de contexto implementado y validado en desktop. La resolución granular de ubicaciones permitidas se completará junto con el modelo mock de permisos.

## Roles y alcance

El rol define **qué acciones** puede realizar el miembro. La asignación de ubicación define **dónde** puede realizarlas.

Dos personas pueden compartir el rol Administrador y tener alcances distintos, por ejemplo Lima y Chiclayo. El Owner tiene alcance global inicialmente, sin impedir que seleccione una ubicación concreta para operar.

Modelo inicial de alcance:

```text
locationScope: ALL | SELECTED
locationIds: string[]
```

Esta simplificación podrá evolucionar a alcances por permiso si aparecen casos que lo requieran.

Solo `OWNER` y `MEMBER` son identidades base. La persona que crea la organización recibe inicialmente la condición `OWNER`, que representa titularidad y no simplemente una suma de permisos.

“Administrador”, “cajero” o “encargado de sede” son perfiles de acceso aplicables a un Member. Administrador será una plantilla amplia y comprensible, pero sus permisos y alcance pueden ajustarse sin convertirlo en Owner.

- Un Member con una ubicación asignada entra directamente a ella y no ve otras ubicaciones ni la vista consolidada.
- Un Member con alcance global puede acceder a “Todas las ubicaciones” y cambiar a una ubicación concreta, pero solo ve módulos y acciones permitidos.
- El Owner tiene alcance global y conserva además las acciones exclusivas de propiedad.

### Acciones exclusivas de propiedad

El conjunto exclusivo del Owner debe ser deliberadamente pequeño:

- transferir la propiedad;
- designar o retirar otros Owners si el producto admite copropiedad;
- cerrar, archivar definitivamente o eliminar la organización;
- aprobar acciones que puedan dejar a la organización sin Owner.

Facturación, equipo, capacidades, canales e integraciones pueden delegarse mediante permisos explícitos. Esto permite que un Administrador opere prácticamente todo sin confundir administración con propiedad.

### Experiencia para asignar permisos

El Owner no configura una matriz extensa al invitar a una persona. El flujo progresivo será:

1. Elegir un perfil sugerido, como Administrador, Ventas y atención, Inventario y compras o Contenido y canales.
2. Elegir alcance: organización completa, todas las ubicaciones o ubicaciones específicas.
3. Revisar y confirmar la invitación.
4. Usar “Personalizar” solo cuando necesite modificar el perfil.

Los perfiles son plantillas de permisos para Members, no nuevas identidades de propiedad. La personalización por módulo utiliza niveles comprensibles: sin acceso, solo ver, operar o administrar. Acciones sensibles como reembolsar, cancelar, ajustar stock o invitar miembros aparecen como opciones avanzadas explícitas.

Una configuración personalizada podrá guardarse como plantilla reutilizable para evitar repetir trabajo en organizaciones grandes.

## Complejidad progresiva

- Un negocio pequeño con un Owner y ninguna o una ubicación no debe enfrentarse a selectores o configuración empresarial innecesaria.
- Una empresa con varias ubicaciones debe poder asignar miembros, consolidar información y limitar accesos.
- Los grupos y enlaces del sidebar se muestran solo cuando coinciden capacidad activa, permiso efectivo y contexto compatible.
- Ocultar navegación es una decisión de UI; la autorización real también debe validarse en rutas, acciones y backend.

## Navegación y alcance de módulos

El sidebar conserva su agrupación por dominios y se construye desde el contexto del workspace. Un enlace solo se muestra cuando coinciden la capacidad activa, el permiso efectivo y el alcance asignado. Los módulos no autorizados se ocultan; no se presentan con candados.

Clasificación aprobada:

- **Locales:** Punto de venta, Caja, Inventario y Compras. Exigen una ubicación operativa.
- **Globales:** Equipo y permisos, Configuración, Canales de venta, CMS/Sitio web y Facturación.
- **Híbridos:** Overview, Pedidos, Catálogo, Promociones, CRM, Agenda, Marketing, Marketplace, Reportes y Auditoría. Admiten una vista consolidada o filtrada según permisos y contexto.

En “Vista general”, un módulo local continúa visible para quien tenga acceso. Al abrirlo se solicita una ubicación; si solo hay una disponible se selecciona automáticamente. Si ninguna ubicación cumple la capacidad requerida, la interfaz explica cómo configurarla en vez de navegar a una superficie inválida.

Organización acordada del dominio Presencia:

- “Canales de venta” será una entrada propia.
- Blog se integra dentro de CMS/Sitio web y deja de ser un módulo principal.
- Marketplace permanece separado porque también representa descubrimiento y ficha pública de Zentro.
- Ubicaciones se administra dentro del Centro de configuración.

Desktop y móvil comparten exactamente las mismas reglas de navegación y contexto.

## Presencia y canales de venta

Cada organización obtiene una ficha pública de Zentro en estado borrador. El Owner debe confirmar los datos antes de publicarla en el Marketplace; crear una organización no expone información automáticamente.

`SalesChannel` será un concepto independiente de CMS y ubicaciones. Los canales previstos incluyen POS, Marketplace Zentro, Web Zentro, venta manual, WhatsApp, Instagram, Facebook, TikTok y futuras integraciones como Shopify.

- CMS construye y administra el canal Web profesional.
- Marketplace Zentro permite descubrimiento y presencia local.
- Un POS está vinculado a una ubicación operativa concreta.
- Los canales sociales pueden comenzar como origen manual o asistido y evolucionar a integración automática.
- Todos los canales crean pedidos normalizados en la bandeja central, conservando canal de origen, referencia externa, cliente, pago y ubicación de atención.
- El canal de venta y la ubicación que prepara o despacha son dimensiones independientes.

El Centro de configuración muestra canales conectados, disponibles y recomendados sin obligar al negocio a habilitarlos todos.

## Catálogo y surtido por ubicación

La organización mantiene un catálogo maestro de productos y servicios. Cada ubicación configura su surtido operativo sin duplicar la identidad del producto:

- producto activo u oculto;
- precio local o precio general;
- disponibilidad y horarios;
- inventario propio cuando corresponda;
- publicación por canal.

Al agregar una ubicación, el Owner elige entre copiar el surtido de otra, seleccionar productos existentes o comenzar vacío. Un negocio sin ubicaciones utiliza el catálogo general; una ficha de Marketplace puede publicarse sin catálogo.

Cada pedido conserva por separado el canal de origen y la ubicación que lo atiende. Esto permite analizar ventas por canal, por ubicación o combinando ambas dimensiones.

## Modelo de ubicaciones

- Existe una sola entidad flexible: `Ubicación`; no se divide en tipos rígidos y excluyentes como sucursal, almacén u oficina.
- Sus funciones se configuran con la pregunta «¿Qué sucede aquí?»: atención al público, POS, inventario, preparación de pedidos, recojo, delivery, citas y presencia pública.
- Una ubicación puede combinar varias funciones y modificarlas conforme el negocio evoluciona.
- La dirección y ficha pública son opcionales: una casa, cocina o almacén puede operar de forma privada sin aparecer en el marketplace.
- Los módulos y acciones disponibles se adaptan a las funciones activadas; una organización digital o de servicios puede operar sin ubicaciones.

## Asignación de pedidos

En la primera versión, cada pedido es atendido por una sola ubicación; no se divide un carrito entre varias.

Cada canal configura uno de estos modos:

- **Automático:** Zentro asigna según cobertura, horario, surtido, disponibilidad y prioridad configurada.
- **Elección del cliente:** por ejemplo, recojo en una sucursal seleccionada durante la compra.
- **Manual:** el pedido entra a la bandeja “Por asignar”.

Casos base:

- POS hereda la ubicación de su terminal.
- Recojo utiliza la ubicación elegida por el cliente.
- Delivery resuelve una ubicación compatible con la dirección y disponibilidad.
- Canales sociales pueden usar una ubicación predeterminada o la bandeja manual.
- Organizaciones sin ubicaciones mantienen el pedido en contexto general.

Si una ubicación deja de poder atender un pedido, un usuario autorizado puede reasignarlo indicando motivo. El historial conserva ubicación anterior, ubicación nueva, actor y momento del cambio. Si ninguna ubicación cumple una regla automática, el pedido queda visible “Por asignar” y genera una alerta; nunca desaparece ni se rechaza silenciosamente.

## Decisiones relacionadas pendientes

- Implementar capacidades, permisos efectivos y asignaciones de ubicación en el mock del workspace.
- Hacer que el sidebar filtre sus grupos y enlaces desde ese contexto.
- Construir el Centro de configuración y su sección de ubicaciones.
