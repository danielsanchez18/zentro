# Auth — Contexto para agente (2 min)

> Léeme antes de tocar cualquier archivo de autenticación.

## Flujo general

```
Paso 1: Email     ──check──→  ¿Existe?  ──sí──→  Paso 2: Contraseña  (login)
  (o Social)                                      Paso 2: "Ya existe" (register)
                              ──no───→  Paso 2: "No existe" (login)
                                         Paso 2: Nombres + Password (register)
```

## Rutas

| Ruta | Formulario | Paso |
|---|---|---|
| `/ingresar` | `LoginForm` | 1: email / 2: password |
| `/registrar` | `RegisterForm` | 1: email / 2: datos |
| `/forgot-password?email=` | `ForgotPassword` | OTP 6 dígitos |
| `/reset-password?email=` | `ResetPasswordForm` | Nueva contraseña |

## Componentes clave

- **`LoginForm.tsx`** — Two-step (email → password). `SendCodeDialog` anidado.
- **`RegisterForm.tsx`** — Two-step (email → names + password).
- **`SocialLogin.tsx`** — Google + Facebook (mismo componente en ambas páginas).
- **`SendCodeDialog.tsx`** — Modal → redirige a `/forgot-password`.
- **`ForgotPassword.tsx`** — InputOTP con 6 slots.
- **`ResetPasswordForm.tsx`** — Dos inputs password con validación de coincidencia.

## Reglas de validación (próximamente en backend)

- Email: regex + check existencia en BD
- Register: email no debe existir / Login: email debe existir
- Password: mínimo 8 caracteres en registro
- OTP: 6 dígitos numéricos

## Archivos

```
src/components/auth/         → LoginForm, RegisterForm, SocialLogin, AuthHeader
src/components/forgot-password/ → SendCodeDialog, ForgotPassword, ResetPasswordForm
src/app/(auth)/              → 4 rutas agrupadas
```

## No hacer

- No quites el `Suspense` de las páginas (usa `useSearchParams`).
- No elimines el `SocialLogin` — es el mismo componente para login y registro.
- No cambies la URL scheme (`?email=...`) sin actualizar todas las páginas.
