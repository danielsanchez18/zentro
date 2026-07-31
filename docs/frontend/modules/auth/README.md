# Módulo de Autenticación — Zentro

> Documentación completa del flujo de autenticación: registro, inicio de sesión y recuperación de contraseña.

---

## Arquitectura del módulo

### Árbol de componentes

```
app/(auth)/
├── ingresar/page.tsx          → AuthHeader + LoginForm
├── registrar/page.tsx         → AuthHeader + RegisterForm
├── forgot-password/page.tsx   → AuthHeader + ForgotPassword
└── reset-password/page.tsx    → AuthHeader + ResetPasswordForm

components/auth/
├── AuthHeader.tsx             Logo + título + descripción (usado en todas)
├── LoginForm.tsx              Flujo completo de inicio de sesión
├── RegisterForm.tsx           Flujo completo de registro
└── SocialLogin.tsx            Botones Google / Facebook

components/forgot-password/
├── SendCodeDialog.tsx         Diálogo modal para enviar código
├── ForgotPassword.tsx         Ingreso de código OTP (6 dígitos)
└── ResetPasswordForm.tsx      Creación de nueva contraseña
```

### Mapa de rutas

| Ruta | Página | Componente principal |
|---|---|---|
| `/ingresar` | Iniciar sesión | `LoginForm` |
| `/ingresar?email=...` | Ingresar contraseña | `LoginForm` (paso 2) |
| `/registrar` | Crear cuenta | `RegisterForm` |
| `/registrar?email=...` | Completar datos | `RegisterForm` (paso 2) |
| `/forgot-password?email=...` | Verificar código | `ForgotPassword` |
| `/reset-password?email=...` | Nueva contraseña | `ResetPasswordForm` |

---

## 1. Flujo de Registro (`/registrar`)

> Es la puerta de entrada principal del sistema. El usuario **primero se registra**, luego accede al dashboard.

```
───[ Paso 1: Email / Social ]──────────────────────────────────────┐
                                                                    │
  ┌──────────────────────────────────────┐                          │
  │                                      │                          │
  │   ┌─ Google ─┐  ┌─ Facebook ─┐      │   (Social Login)        │
  │   │          │  │           │       │                          │
  │   └──────────┘  └───────────┘      │                          │
  │         │              │            │                          │
  │         └──────┬───────┘            │                          │
  │                ▼                    │                          │
  │      ┌─────────────────┐           │                          │
  │      │ o continuar con │            │                          │
  │      └─────────────────┘           │                          │
  │                                      │                          │
  │   ┌──────────────────────────────┐ │                          │
  │   │ ✉︎  Ingresa tu correo electrónico │                          │
  │   └──────────────────────────────┘ │                          │
  │   ┌──────────────────────────────┐ │                          │
  │   │   Continuar con correo...    │ │                          │
  │   └──────────────────────────────┘ │                          │
  │                                      │                          │
  │   ¿Ya tienes cuenta? → Inicia sesión │                          │
  └──────────────────────────────────────┘                          │
                      │                                             │
                      ▼                                             │
           ┌──────────────────┐                                     │
           │ ¿Email válido?   │──── No ──→ "Formato inválido"      │
           └──────────────────┘                    │                │
                      │ (sí)                       │                │
                      ▼                            │                │
           ┌──────────────────┐                    │                │
           │ ¿Email existe?   │──── Sí ──→ "Ya existe. Inicia       │
           │  (check BD)      │           sesión" → link a /ingresar│
           └──────────────────┘                                     │
                      │ (no)                                        │
                      ▼                                             │
───[ Paso 2: Completar datos ]──────────────────────────────────────┘
│
│  ┌──────────────────────────────────────┐
│  │  ✉︎  usuario@correo.com              │  (email confirmado, read-only)
│  └──────────────────────────────────────┘
│
│  ┌──────────────┐  ┌──────────────┐
│  │ 👤  Nombres   │  │ 👤  Apellidos │
│  └──────────────┘  └──────────────┘
│
│  ┌──────────────────────────────┐
│  │ 🔒  Crea una contraseña      │
│  └──────────────────────────────┘
│
│  ┌──────────────────────────────┐
│  │       Crear cuenta           │
│  └──────────────────────────────┘
│              │
│              ▼
│    ┌─────────────────┐
│    │ Cuenta creada   │
│    │ → /dashboard    │
│    └─────────────────┘
```

### Estados del formulario de registro

| Estado | Descripción | UI |
|---|---|---|
| **Inicial** | Email vacío, sin errores | Social buttons + input email + botón "Continuar" |
| **Email inválido** | No pasa regex | `emailError` = "Ingresa un formato de correo válido." + borde rojo |
| **Verificando email** | Llamando a backend | Botón deshabilitado con "Verificando…" + `Loader2` |
| **Email ya existe** | Backend responde 409 | `emailError` = "Este correo ya está registrado. Inicia sesión." + link a `/ingresar` |
| **Email disponible** | Backend responde 200 | Transición al paso 2 |
| **Paso 2: Completando** | Inputs de nombre y contraseña visibles | Campos: nombres, apellidos, contraseña |
| **Registrando** | Enviando datos al backend | Botón deshabilitado con `Loader2` spinner |
| **Error registro** | Fallo en creación | Mensaje de error contextual |
| **Registro exitoso** | Cuenta creada | Redirección a `/dashboard` |

### Validaciones

| Campo | Regla | Mensaje |
|---|---|---|
| Email | `^[^\s@]+@[^\s@]+\.[^\s@]+$` | "Ingresa un formato de correo válido." |
| Email | Que no exista en BD | "Este correo ya está registrado. Inicia sesión." |
| Nombres | Requerido, min 2 caracteres | Validación HTML5 `required` |
| Apellidos | Requerido, min 2 caracteres | Validación HTML5 `required` |
| Contraseña | Mínimo 8 caracteres | Validación por definir |
| Contraseña | Complejidad (mayúscula, número) | Validación por definir |

---

## 2. Flujo de Inicio de Sesión (`/ingresar`)

```
───[ Paso 1: Email / Social ]──────────────────────────────────────┐
                                                                    │
  ┌──────────────────────────────────────┐                          │
  │   ┌─ Google ─┐  ┌─ Facebook ─┐      │                          │
  │   │          │  │           │       │                          │
  │   └──────────┘  └───────────┘      │                          │
  │         │              │            │                          │
  │         └──────┬───────┘            │                          │
  │                ▼                    │                          │
  │      ┌─────────────────┐           │                          │
  │      │ o continuar con │            │                          │
  │      └─────────────────┘           │                          │
  │                                      │                          │
  │   ┌──────────────────────────────┐ │                          │
  │   │ ✉︎  Ingrese su correo...     │                          │
  │   └──────────────────────────────┘ │                          │
  │   ┌──────────────────────────────┐ │                          │
  │   │   Continuar con correo...    │ │                          │
  │   └──────────────────────────────┘ │                          │
  │                                      │                          │
  │   ¿No tienes cuenta? → Empieza ahora │                          │
  └──────────────────────────────────────┘                          │
                      │                                             │
                      ▼                                             │
           ┌──────────────────┐                                     │
           │ ¿Email válido?   │── No ──→ "Ingresa un formato de    │
           └──────────────────┘          correo válido."            │
                      │                                             │
                      ▼ (sí)                                        │
           ┌──────────────────┐                                     │
           │ ¿Email existe?   │── No ──→ "Este correo no está       │
           │  (check BD)      │          registrado."               │
           └──────────────────┘          └→ link a /registrar       │
                      │ (sí)                                        │
                      ▼                                             │
───[ Paso 2: Contraseña ]───────────────────────────────────────────┘
│
│  ┌──────────────────────────────────────┐
│  │  ✉︎  usuario@correo.com              │  (email confirmado, read-only)
│  └──────────────────────────────────────┘
│
│  ┌──────────────────────────────┐
│  │ 🔒  Ingrese su contraseña    │
│  └──────────────────────────────┘
│
│  ┌──────────────────────────────┐
│  │       Iniciar sesión         │
│  └──────────────────────────────┘
│
│  ¿Olvidaste tu contraseña? → Restablecer
│              │
│              ▼
│    ┌─────────────────┐
│    │ ¿Credenciales   │── No ──→ "Credenciales inválidas."
│    │  válidas?       │
│    └─────────────────┘
│           │ (sí)
│           ▼
│    ┌─────────────────┐
│    │ → /dashboard    │
│    └─────────────────┘
```

### Estados del formulario de login

| Estado | Descripción | UI |
|---|---|---|
| **Inicial** | Email vacío, sin errores | Social buttons + input email + botón "Continuar" |
| **Email inválido** | No pasa regex | `emailError` = "Ingresa un formato de correo válido." + borde rojo |
| **Verificando email** | Llamando a backend | Botón deshabilitado con "Verificando…" |
| **Email no existe** | Backend responde 404 | `emailError` = "Este correo no está registrado." + link a `/registrar` |
| **Email existe** | Backend responde 200 | Transición al paso 2 |
| **Paso 2: Contraseña** | Input de contraseña visible | + link "Restablecer" (SendCodeDialog) |
| **Validando credenciales** | Verificando password | Botón deshabilitado con "Verificando…" |
| **Credenciales inválidas** | Password incorrecto | "Contraseña incorrecta." + opción "Restablecer" |
| **Login exitoso** | Autenticación OK | Redirección a `/dashboard` |

### Validaciones

| Campo | Regla | Mensaje |
|---|---|---|
| Email | `^[^\s@]+@[^\s@]+\.[^\s@]+$` | "Ingresa un formato de correo válido." |
| Email | Que exista en BD | "Este correo no está registrado." + link registro |
| Contraseña | No vacía | Validación HTML5 `required` |
| Contraseña | Coincida con hash en BD | "Contraseña incorrecta." |

---

## 3. Flujo de Recuperación de Contraseña

```
───[ Desde Login, paso 2 ]──────────────────────────────────────────
│
│  ¿Olvidaste tu contraseña? → "Restablecer"
│                                    │
│                                    ▼
│                    ┌──────────────────────────┐
│                    │  Restablecer contraseña  │  ← SendCodeDialog
│                    │                          │
│                    │  Te enviaremos un código  │
│                    │  a usuario@correo.com     │
│                    │                          │
│                    │  [Cancelar] [Enviar código]│
│                    └──────────────────────────┘
│                                    │
│                         "Enviar código"
│                                    │
│                                    ▼
│                     ┌──────────────────────┐
│                     │  /forgot-password    │
│                     │  ?email=...          │
│                     └──────────────────────┘
│                                    │
───[ Paso 1: Ingresar código OTP ]─────────────────────────────────┘
│
│  ┌──────────────────────────────────────┐
│  │  Verifica tu correo                  │
│  │  Ingresa el código de seguridad      │
│  │  que enviamos a                      │
│  │  usuario@correo.com                  │
│  └──────────────────────────────────────┘
│
│     ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐
│     │  │ │  │ │  │ │  │ │  │ │  │     ← InputOTP 6 dígitos
│     └──┘ └──┘ └──┘ └──┘ └──┘ └──┘
│
│  ┌────────────┐  ┌────────────┐
│  │ Reenviar    │  │ Confirmar  │
│  │ código      │  │            │
│  └────────────┘  └────────────┘
│                          │
│                          ▼
│              ┌──────────────────────┐
│              │  /reset-password     │
│              │  ?email=...          │
│              └──────────────────────┘
│                          │
───[ Paso 2: Nueva contraseña ]─────────────────────────────────────┘
│
│  ┌──────────────────────────────────────┐
│  │  Actualizar contraseña               │
│  │  Asegúrate de que sea segura         │
│  │  y fácil de recordar.                │
│  └──────────────────────────────────────┘
│
│  ┌──────────────────────────────┐
│  │ 🔒  Nueva contraseña         │
│  └──────────────────────────────┘
│
│  ┌──────────────────────────────┐
│  │ 🔒  Confirmar contraseña     │
│  └──────────────────────────────┘
│
│  ┌──────────────────────────────┐
│  │    Actualizar contraseña     │
│  └──────────────────────────────┘
│              │
│              ▼
│    ┌─────────────────┐
│    │ ¿Contraseñas    │── No ──→ "Las contraseñas no coinciden."
│    │  coinciden?     │
│    └─────────────────┘
│           │ (sí)
│           ▼
│    ┌─────────────────┐
│    │ ¿Cumple         │── No ──→ "Debe tener al menos 8 caracteres..."
│    │  requisitos?    │
│    └─────────────────┘
│           │ (sí)
│           ▼
│    ┌──────────────────────────────┐
│    │ Contraseña actualizada       │
│    │ → /ingresar?email=...        │
│    └──────────────────────────────┘
```

### Estados de recuperación

| Estado | Descripción | UI |
|---|---|---|
| **Dialog abierto** | Modal "Restablecer contraseña" | SendCodeDialog con email |
| **Enviando código** | Backend envía email | Botón "Enviar código" → loading |
| **Código enviado** | Redirección a `/forgot-password` | Transición a página OTP |
| **OTP: Ingresando** | Usuario tipea 6 dígitos | InputOTP con slots individuales |
| **OTP: Reenviar** | Solicitar nuevo código | Botón "Reenviar código" |
| **OTP: Confirmando** | Validando código | Botón "Confirmar" → loading |
| **OTP: Inválido** | Código incorrecto | "Código inválido. Intenta de nuevo." |
| **OTP: Válido** | Código OK | Transición a `/reset-password` |
| **Nueva contraseña** | Ingresar y confirmar | Dos inputs password |
| **No coinciden** | Password ≠ Confirm | "Las contraseñas no coinciden." |
| **Actualizando** | Backend actualiza | Botón "Actualizar contraseña" → loading |
| **Actualización exitosa** | Contraseña cambiada | Redirección a `/ingresar?email=...` |

### Validaciones

| Campo | Regla | Mensaje |
|---|---|---|
| Código OTP | 6 dígitos numéricos | "El código debe tener 6 dígitos." |
| Código OTP | Coincida con el enviado | "Código inválido. Intenta de nuevo." |
| Nueva contraseña | Mínimo 8 caracteres | "Debe tener al menos 8 caracteres." |
| Confirmar contraseña | === Nueva | "Las contraseñas no coinciden." |

---

## 4. Componente SocialLogin

```
┌────────────────────────────────────┐
│  ───────── o continuar con ──────── │
│                                      │
│  ┌──────────────┐ ┌──────────────┐ │
│  │  Google       │ │  Facebook    │ │
│  └──────────────┘ └──────────────┘ │
└────────────────────────────────────┘
```

- Se muestra tanto en `/ingresar` como en `/registrar`.
- Cada botón inicia el flujo OAuth correspondiente.
- Al completar OAuth, el backend debe:
  - Si el email ya existe: iniciar sesión (login).
  - Si el email no existe: crear cuenta (registro automático).
- El diseño es idéntico en ambas páginas (mismo componente).

---

## 5. Diagrama de estados general

```
                  ┌──────────────┐
                  │  Landing /   │
                  │  Home        │
                  └──────┬───────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
   ┌──────────┐   ┌──────────┐   ┌──────────────┐
   │ /ingresar│   │/registrar│   │ /forgot-pass │
   └────┬─────┘   └────┬─────┘   │ ?email=...   │
        │              │         └──────┬───────┘
        │ (email OK)   │ (email OK)     │ (código OK)
        ▼              ▼                ▼
   ┌──────────┐   ┌──────────┐   ┌──────────────┐
   │ Contraseña│   │ Nombres + │   │/reset-pass  │
   │           │   │ Password  │   │ ?email=...  │
   └────┬─────┘   └────┬─────┘   └──────┬───────┘
        │              │                │ (password OK)
        │ (creds OK)   │ (creado)       │
        └──────┬───────┘                │
               │                        │
               ▼                        │
        ┌──────────┐                    │
        │/dashboard│◀───────────────────┘
        └──────────┘
```

---

## 6. Reglas de negocio

1. **El registro es la puerta principal** — El flujo esperado es que el usuario cree una cuenta primero.
2. **Validación de email antes de mostrar formulario** — Ambos flujos (login/register) verifican el email contra la BD antes de pasar al paso 2.
3. **Social Login es bidireccional** — Un mismo botón de Google/Facebook sirve tanto para login como para registro (detección automática del lado del backend).
4. **Recuperación de contraseña requiere email verificado** — El código OTP se envía al email confirmado en el paso anterior.
5. **Tiempo de expiración del código OTP** — El código de 6 dígitos expira en N minutos (por definir).
6. **Dashboard protegido** — Todas las rutas bajo `(dashboard)` requieren sesión activa.

---

## 7. API Contract (planeado)

### 7.1 Auth — Verificar email

```
POST /api/auth/check-email
Body: { email: string }

200 → { exists: true }   // El email está registrado
200 → { exists: false }  // El email está disponible
```

### 7.2 Auth — Registro

```
POST /api/auth/register
Body: { email, firstName, lastName, password }

201 → { token, user }
409 → { message: "El correo ya está registrado." }
```

### 7.3 Auth — Login

```
POST /api/auth/login
Body: { email, password }

200 → { token, user }
401 → { message: "Credenciales inválidas." }
```

### 7.4 Auth — Recuperación

```
POST /api/auth/forgot-password
Body: { email }

200 → { message: "Código enviado." }

POST /api/auth/verify-code
Body: { email, code }

200 → { valid: true }
401 → { message: "Código inválido." }

POST /api/auth/reset-password
Body: { email, code, password }

200 → { message: "Contraseña actualizada." }
```

---

## 8. Pendientes / Por definir

- [ ] **Validación de fortaleza de contraseña** (mínus, mayúsc, número, especial)
- [ ] **Expiración del código OTP** (¿5 min?)
- [ ] **Límite de intentos** de código OTP (¿3 intentos?)
- [ ] **Límite de intentos** de contraseña (¿5 intentos → bloquear?)
- [ ] **Integración OAuth real** con Google y Facebook
- [ ] **Manejo de sesión** (JWT, refresh token, cookies)
- [ ] **Protección CSRF** en formularios
- [ ] **reCAPTCHA** o similar para prevenir bots

---

## 9. Notas de accesibilidad implementadas

| Componente | Mejora |
|---|---|
| Todos los inputs | `aria-label` descriptivo |
| Navbar | `aria-label="Navegación principal"` |
| Botón hamburguesa | `aria-label="Abrir menú de navegación"` |
| SVGs decorativos | `aria-hidden="true"` |
| Links placeholder | `href="#"` con `aria-label` |
| Formularios | `id` + `aria-label` en cada input |
| InputOTP | `aria-label="Código de verificación"` |
