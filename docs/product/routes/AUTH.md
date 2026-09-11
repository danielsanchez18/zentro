# Páginas de acceso y recuperación

## `/ingresar` — Login de usuario

**Estado:** completo en prototipo mock. `/login` no es una ruta vigente; el nombre público actual es `/ingresar`.

### Propósito

Autenticar a una persona y enviarla a su Dashboard Hub, nunca directamente a una organización asumida.

### Implementado

- Primer paso por correo y segundo paso por contraseña.
- Formato de correo, campos requeridos y mensajes contextuales.
- Enlace a registro y recuperación.
- Google y Facebook visibles como alternativas de acceso.
- Redirección al Hub tras autenticación mock.
- Guest guard para evitar mostrar auth con una sesión mock activa.

### Restricciones y reglas

- Un usuario deshabilitado no debe iniciar ni renovar sesión.
- Los errores no deben revelar información sensible innecesaria.
- La ubicación o última organización recordada no concede permisos.

### Issues pendientes

- Autenticación y sesión reales, cookies seguras, renovación y cierre global.
- Estado deshabilitado/bloqueado y límite de intentos.
- OAuth real y proveedores definitivos.
- Protección CSRF y controles antiabuso cuando corresponda.

## `/registrar` — Signup de usuario

**Estado:** completo en prototipo mock. `/signup` no es una ruta vigente; el nombre público actual es `/registrar`.

### Propósito

Crear una identidad personal y darle acceso al Dashboard Hub. Registrarse no crea automáticamente una organización ni una ubicación.

### Implementado

- Paso de correo y paso de nombres, apellidos y contraseña.
- Validación visual del correo y longitud mínima de contraseña.
- Social login compartido con Login.
- Redirección al Hub tras el registro mock.

### Restricciones y reglas

- El correo normalizado debe ser único.
- La creación del usuario debe ser idempotente.
- Organización, membresía y ubicación son entidades posteriores y separadas.

### Issues pendientes

- Persistencia real, unicidad autoritativa y verificación de correo.
- Política definitiva de contraseña y aceptación legal.
- Registro mediante proveedores sociales.

## `/forgot-password?email=` — Código de recuperación

**Estado:** completo en prototipo mock.

- Recibe el correo desde Login.
- Captura OTP de seis dígitos y permite reenvío.
- Falta entrega real, expiración, rate limiting, intentos y token de recuperación seguro.

## `/reset-password?email=` — Nueva contraseña

**Estado:** completo en prototipo mock.

- Solicita nueva contraseña y confirmación.
- Valida coincidencia y requisitos básicos.
- Falta token de un solo uso, invalidación de sesiones y persistencia real.

Documentación detallada: [módulo Auth](../../frontend/modules/auth/README.md).

