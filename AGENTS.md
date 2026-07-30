# AGENTS.md — Frontend (zentro)

> **Archivo de navegación para agentes IA.** Si eres un agente trabajando en este proyecto, lee esto primero para saber exactamente qué archivos necesitas.

## 📋 ¿En qué vas a trabajar?

### Si tu tarea es sobre **Auth** (login, registro)
→ Lee `docs/agents/frontend/auth/README.md` (2 min)
→ Archivos: `src/app/(auth)/*`, `src/components/features/auth/*`

### Si tu tarea es sobre **Projects** (gestión de proyectos)
→ Lee `docs/agents/frontend/projects/README.md` (2 min)
→ Archivos: `src/app/(dashboard)/projects/*`, `src/components/features/projects/*`

### Si tu tarea es sobre **UI / Componentes globales**
→ Archivos: `src/components/ui/*`, `src/app/layout.tsx`

### Si tu tarea es sobre **Arquitectura general**
→ Lee `docs/02-ARCHITECTURE.md` (5 min)

## 🚫 Qué NO hacer
- No modifiques componentes fuera del módulo que te corresponde.
- No instales dependencias sin consultar al orchestrator.
- No conviertas Server Components a Client Components sin justificación.
- No modifiques el `layout.tsx` raíz sin aprobación del orchestrator.

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   └── (dashboard)/
│       ├── layout.tsx
│       ├── projects/
│       └── settings/
├── components/
│   ├── ui/                     # shadcn/ui components
│   └── features/               # Feature-specific
│       ├── auth/
│       └── projects/
├── lib/
│   └── api/                    # API client
├── stores/                     # Zustand stores
├── types/                      # TypeScript types
└── hooks/                      # Custom hooks
```

## 🧭 Documentación relacionada

| Archivo | Para qué |
|---|---|
| `docs/frontend/README.md` | Visión general del frontend |
| `docs/frontend/modules/auth/README.md` | Documentación completa Auth |
| `docs/agents/frontend/auth/README.md` | Contexto mínimo para agente (Auth) |
| `docs/progress/CURRENT.md` | Tarea actual del proyecto |
| `docs/decisions/*.md` | Decisiones arquitectónicas |
