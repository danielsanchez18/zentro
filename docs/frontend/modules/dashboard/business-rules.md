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
