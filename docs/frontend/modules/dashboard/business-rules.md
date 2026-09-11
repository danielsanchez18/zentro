# Dashboard — Reglas de negocio y seguridad

> Estas reglas deben ejecutarse en backend cuando comience la integración. El frontend solo anticipa estados y mensajes.

## Cuenta y autenticación

1. El correo normalizado debe ser único entre usuarios activos y pendientes.
2. Un usuario `DISABLED` no puede iniciar sesión, renovar sesión ni usar OAuth.
3. Un usuario `PENDING_VERIFICATION` puede tener acceso restringido según la política, pero no se trata como verificado.
4. Las credenciales inválidas no deben revelar si el correo existe.
5. Las contraseñas nunca se almacenan ni retornan en texto plano.
6. Un proveedor externo se identifica por `provider + providerAccountId`; esa pareja es única.
7. Vincular Google, Facebook o Apple exige comprobar que la sesión externa pertenece al usuario.
8. No se puede desconectar la última identidad utilizable de una cuenta.
9. Si un proveedor devuelve un correo ya registrado, el backend no fusiona cuentas automáticamente sin una verificación segura.
10. Cambiar correo o teléfono requiere validación y auditoría según su sensibilidad.
11. Cambiar contraseña debe invalidar o rotar las sesiones según la política de seguridad y notificar al usuario.
12. Una sesión solo puede ser revocada por su dueño o por un administrador de seguridad autorizado.
13. La ubicación de una sesión es aproximada y no debe presentarse como ubicación exacta garantizada.
14. Avisos de recuperación y seguridad son obligatorios; marketing siempre es opcional.

## Organizaciones y membresías

15. Crear una organización crea una membresía `OWNER`; no crea obligatoriamente una sucursal.
16. El slug normalizado debe ser único y se valida en servidor.
17. Solo membresías `ACTIVE` permiten entrar a una organización.
18. Un usuario suspendido en una organización puede conservar acceso a otras.
19. No se puede abandonar una organización si el usuario es su último Owner; antes debe transferir propiedad o cerrar la organización.
20. Los conteos de miembros y sucursales se calculan desde entidades vigentes, no se editan directamente.

## Invitaciones

21. Solo usuarios con permiso pueden invitar o revocar.
22. Una invitación pendiente debe ser única por organización y correo para el mismo propósito.
23. Solo el destinatario puede aceptarla o rechazarla; debe estar pendiente y no vencida.
24. Aceptar crea una membresía de forma idempotente y cambia el estado de la invitación en la misma transacción.
25. Rechazar, revocar o expirar no crea membresía y conserva historial.

## Suscripciones

26. La suscripción pertenece a la organización, no al usuario; el dashboard la muestra mediante la membresía.
27. Ver facturas o gestionar cobros requiere permisos apropiados en esa organización.
28. Los planes y límites actuales son provisionales y no deben fijar dependencias del dominio.
29. La cancelación conserva acceso hasta el final del período cuando `cancelAtPeriodEnd` sea verdadero.

## Onboarding

30. El onboarding se adapta a las capacidades elegidas.
31. Configurar sucursal es opcional salvo que una capacidad elegida tenga esa dependencia dura, por ejemplo POS.
32. Omitir onboarding no bloquea el dashboard y puede retomarse.
33. “Indispensable para tu rubro” es recomendación de producto, no obligación técnica.

## Workspace y contexto operativo

34. La organización es el contexto raíz del workspace; una ubicación operativa es opcional.
35. El rol define acciones permitidas y la asignación de ubicación define dónde pueden ejecutarse.
36. Sin ubicaciones se abre el contexto general; con una única ubicación permitida se selecciona directamente.
37. Con varias ubicaciones se puede recordar la última selección válida y ofrecer “Todas” solo en módulos compatibles y con permiso global.
38. POS, caja y otras capacidades estrictamente locales requieren una ubicación concreta.
39. Recordar una ubicación nunca concede acceso; el contexto debe revalidarse contra la membresía y asignaciones vigentes.
40. La interfaz oculta selectores innecesarios a negocios pequeños y muestra controles adicionales conforme aumenta su complejidad.

## Presencia y canales

41. Crear una organización genera una ficha pública en borrador, pero no la publica automáticamente.
42. Publicar o retirar una ficha del Marketplace requiere una decisión explícita y permiso suficiente.
43. CMS, Marketplace, POS y canales externos son canales independientes de las ubicaciones operativas.
44. Todo pedido conserva su canal de origen aunque se normalice en la bandeja central de Zentro.
45. La ubicación que atiende un pedido puede elegirse después de recibirlo mediante reglas de cobertura, disponibilidad o selección manual.

## Catálogo y acceso por ubicación

46. Los productos y servicios pertenecen al catálogo maestro de la organización; las ubicaciones definen surtido, precio, disponibilidad e inventario sin duplicar el producto base.
47. Crear una ubicación permite copiar otro surtido, seleccionar productos existentes o comenzar vacío.
48. Canal de origen y ubicación de atención son dimensiones independientes de cada pedido.
49. Un Member limitado a una ubicación no puede descubrir ni consultar datos de otras ubicaciones o de la vista consolidada.
50. Un Member con alcance global puede cambiar de ubicación y acceder a vistas consolidadas únicamente para permisos concedidos.

## Propiedad y administración delegada

51. El creador de una organización se convierte inicialmente en Owner.
52. Owner representa titularidad; Administrador es un perfil amplio de permisos asignable a un Member.
53. Transferir propiedad, modificar Owners y cerrar o eliminar definitivamente la organización son acciones exclusivas de Owner.
54. Facturación, equipo, capacidades, canales e integraciones pueden delegarse mediante permisos explícitos.
55. Ninguna operación puede dejar una organización activa sin al menos un Owner.

## Perfiles y permisos

56. Los perfiles sugeridos son plantillas editables de permisos para Members; no crean nuevas categorías de propiedad.
57. Invitar un Member requiere definir perfil de acceso y alcance antes de confirmar.
58. La personalización básica usa niveles por módulo: sin acceso, ver, operar y administrar.
59. Acciones sensibles requieren permisos atómicos explícitos aunque el módulo tenga acceso general.
60. Las plantillas personalizadas pertenecen a la organización y pueden reutilizarse.

## Enrutamiento de pedidos

## Ubicaciones operativas

67. `Ubicación` es una entidad única y flexible; sus capacidades no se modelan mediante un tipo exclusivo.
68. Una ubicación puede atender público, operar POS, almacenar inventario, preparar pedidos, ofrecer recojo, realizar delivery, gestionar citas y/o publicarse.
69. Una ubicación puede cambiar o combinar funciones sin migrar a otra entidad.
70. La publicación, dirección visible y aparición en el mapa son opciones explícitas e independientes de su uso operativo.
71. Una organización puede operar sin ubicaciones cuando su modelo sea digital, publicitario o de servicios sin atención física.

61. En la primera versión, un pedido solo puede tener una ubicación de atención activa y no se divide entre ubicaciones.
62. Cada canal utiliza asignación automática, elección del cliente o asignación manual.
63. POS hereda la ubicación de la terminal; recojo utiliza la elegida por el cliente; delivery considera cobertura, horario, surtido, disponibilidad y prioridad.
64. Un pedido sin coincidencia válida queda `UNASSIGNED` y debe permanecer visible con alerta.
65. Organizaciones sin ubicaciones pueden procesar pedidos con `fulfillmentLocationId` nulo.
66. Toda reasignación requiere permiso, motivo e historial de la ubicación anterior y nueva.
