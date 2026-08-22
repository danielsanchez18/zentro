# AGENTS.md — Frontend (zentro)

> **Archivo de navegación para agentes IA.** Si eres un agente trabajando en este proyecto, lee esto primero.

## 📋 ¿En qué vas a trabajar?

### Primero, lee el plan maestro
→ **`docs/03-ROADMAP.md`** — contiene todas las tareas, su estado y dependencias (5 min)

### Luego, según tu tarea:

| Si tu tarea es sobre | Lee primero | Archivos que tocarás |
|---|---|---|
| **Equipo y permisos** | `docs/frontend/modules/team/README.md` | `src/components/app/team/*`, `src/lib/mock/team.ts`, `src/app/app/[slug]/equipo/**` |
| **Auth** (login, registro, forgot-password, protección de rutas) | `docs/agents/frontend/auth/README.md`, `docs/decisions/005-route-protection.md` | `src/app/(auth)/*`, `src/components/auth/*`, `src/components/forgot-password/*`, `src/hooks/use-*-guard*.ts`, `src/hooks/use-validate-email-param.ts` |
| **Layout / Dashboard** | Notion 05 (Mapa Navegación) | `src/app/dashboard/layout.tsx`, `src/app/layout.tsx`, `src/hooks/use-require-auth.ts` |
| **Catálogo / Productos** | Notion 04 + docs | `src/app/dashboard/catalog/*` |
| **UI / Componentes globales** | — | `src/components/ui/*`, `src/app/layout.tsx` |
| **Modo Mock / Datos de prueba** | `docs/mock-mode.md` | `src/lib/mock/data.ts`, `src/components/ui/mock-help-button.tsx`, `src/components/ui/mock-badge.tsx` |
| **Arquitectura general** | `docs/02-ARCHITECTURE.md`, Notion 06 | — |

> **Modo Mock:** la app puede correr con datos de prueba sin backend. Fuente de datos:
> `src/lib/mock/data.ts`. Botón "?" flotante (solo mock): `src/components/ui/mock-help-button.tsx`.
> Para QUITAR el mock cuando el backend esté listo, sigue `docs/mock-mode.md`.

## 🚫 Reglas

- No modifiques componentes fuera del módulo que te corresponde.
- No instales dependencias sin consultar.
- No conviertas Server Components a Client Components sin justificación.
- No modifiques el `layout.tsx` raíz sin aprobación.
- Siempre verifica `docs/03-ROADMAP.md` para ver el estado actual de tu tarea.

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── (auth)/
│   │   ├── layout.tsx           # Guest guard (ingresar/registrar → dashboard si hay sesión)
│   │   ├── ingresar/page.tsx    # Login
│   │   ├── registrar/page.tsx   # Registro
│   │   ├── forgot-password/page.tsx   # OTP de recuperación
│   │   └── reset-password/page.tsx    # Nueva contraseña
│   ├── (landing)/              # Landing (/, /clientes, /servicios, /planes)
│   └── app/
│       └── [slug]/
│           ├── page.tsx         # Overview
│           └── equipo/
│               ├── page.tsx     # Equipo y permisos (tabs miembros/invitaciones)
│               └── [memberId]/
│                   └── page.tsx # Detalle de miembro
├── components/
│   ├── ui/                     # shadcn/ui + toasts + mock (badge/help)
│   ├── auth/                   # LoginForm, RegisterForm, SocialLogin, AuthHeader
│   ├── forgot-password/        # SendCodeDialog, ForgotPassword (OTP), ResetPasswordForm
│   └── app/
│       ├── team/               # Módulo Equipo y permisos
│       └── shared/             # StatusBadge, Search, Paginator, Breadcrumb, etc.
├── lib/
│   ├── api/                    # API client + auth endpoints
│   ├── services/               # auth.service.ts (mock/API) + reset-code.ts
│   └── mock/                   # Datos de prueba (team.ts, data.ts)
├── stores/                     # Zustand (auth-store, app-store)
├── types/                      # TypeScript
└── hooks/                      # use-require-auth, use-guest-guard, use-validate-email-param
```

## 🧭 Documentación relacionada

| Archivo | Para qué |
|---|---|
| **`docs/03-ROADMAP.md`** | **Plan maestro: tareas, estado, dependencias** |
| `docs/frontend/README.md` | Visión general del frontend |
| `docs/progress/CURRENT.md` | Tarea activa actual |
| `docs/progress/NEXT.md` | Próximas tareas en orden |
| `docs/decisions/*.md` | Decisiones arquitectónicas |
| Notion (04 - Modelo de Dominio) | Entidades y relaciones |
| Notion (05 - Arquitectura Funcional) | Flujos, casos de uso, mapa navegación |
| Notion (06 - Arquitectura Técnica) | Stack, patrones, auth |
