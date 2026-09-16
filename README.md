# Salud Financiera — Banco Popular (Challenge Popular)

Prototipo del módulo "Salud Financiera": score bancario propio, análisis de
gastos, recomendaciones personalizadas de tarjetas reales de Popular, y el
asistente conversacional **Aliado**, integrado a la identidad visual de
Banco Popular.

Equipo Los Búhos — Luis Calderón, Daniel Jiménez, Luis Terrero, Jade Elizabeth.

**Demo en vivo:** https://challenge-popular-app.netlify.app

Documentación completa en [`/docs`](./docs):

- [`docs/PRODUCT.md`](./docs/PRODUCT.md) — el brief de negocio (problema, hipótesis, principios)
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — cómo está armado el código
- [`docs/DATA.md`](./docs/DATA.md) — de dónde sale cada dato mostrado en pantalla
- [`docs/DATABASE.md`](./docs/DATABASE.md) — proyecto Supabase, schema, cómo migrar y sembrar
- [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) — cómo se despliega y variables de entorno

## Quickstart

```bash
npm install
cp .env.example .env.local   # agrega tus credenciales (ver abajo)
npm run db:seed              # siembra Supabase con los datos de ejemplo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) — redirige a
`/salud-financiera`.

Variables requeridas en `.env.local`:

| Variable | Para qué |
|---|---|
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Toda la data del módulo (score, gastos, tarjetas, acciones) |
| `GEMINI_API_KEY` | El chat de Aliado. Sin ella, el resto del módulo funciona igual y el chat muestra un error claro en vez de romperse |

Ver [`docs/DATABASE.md`](./docs/DATABASE.md) y
[`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) para el resto del detalle.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- **Supabase (Postgres)** como base de datos — transacciones, señales de
  cuenta, gastos por categoría y el comparador real de tarjetas Popular
  (`/cards/cards.md`, datos de EfiCredit), todo servido dinámicamente desde
  Server Components
- Asistente **Aliado** vía API de Google Gemini, acotado al diagnóstico ya
  calculado del usuario (sin acceso crudo a la base de datos ni invención de
  cifras)
- Desplegado en Netlify (build + funciones serverless para el chat)
