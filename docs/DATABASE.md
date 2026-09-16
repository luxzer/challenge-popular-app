# Supabase

## Proyecto

- **Organización:** Los Buhos (`rozfpnzjjrbwjkdtdvnk`)
- **Proyecto:** `challenge-popular-app` (ref `ignrdhgxwfmyyhuonxtw`)
- **Región:** `us-east-1`
- **URL:** `https://ignrdhgxwfmyyhuonxtw.supabase.co`
- **Dashboard:** https://supabase.com/dashboard/project/ignrdhgxwfmyyhuonxtw

La contraseña de la base de datos y las API keys (`anon`, `service_role`)
están solo en `.env.local` (gitignored) y en las variables de entorno de
Netlify — no están en ningún archivo commiteado. Si las necesitas de nuevo:
Project Settings → API (keys) / Database (contraseña, si la rotas).

## Schema

Vive en [`supabase/migrations/`](../supabase/migrations), en orden:

- `0001_init.sql` — todas las tablas (ver [`DATA.md`](./DATA.md) para qué
  guarda cada una).
- `0002_categories_sort_order.sql` — agrega `categories.sort_order` (el
  orden alfabético de `id` no coincidía con el orden de exhibición
  delivery→supermercado→transporte→servicios→otros).

Para aplicar una migración nueva contra el proyecto real:

```bash
node -e "
const fs = require('fs');
const sql = fs.readFileSync('supabase/migrations/000N_nombre.sql', 'utf-8');
fetch('https://api.supabase.com/v1/projects/ignrdhgxwfmyyhuonxtw/database/query', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer ' + process.env.SUPABASE_ACCESS_TOKEN, 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: sql })
}).then(r => r.text()).then(console.log);
"
```

(`SUPABASE_ACCESS_TOKEN` aquí es un *Personal Access Token* de
supabase.com/dashboard/account/tokens — distinto de las API keys del
proyecto — solo hace falta para administrar el proyecto, no lo usa la app
en runtime.)

Alternativa equivalente con el CLI, si prefieres tenerlo linkeado:

```bash
npx supabase login --token <personal-access-token>
npx supabase link --project-ref ignrdhgxwfmyyhuonxtw
npx supabase db push
```

## Seed

```bash
npm run db:seed
```

Corre [`scripts/seed.mjs`](../scripts/seed.mjs) con
`node --env-file=.env.local`, usando `SUPABASE_SERVICE_ROLE_KEY` (bypassa
RLS). Es idempotente vía `upsert` — correrlo de nuevo actualiza los datos en
vez de duplicarlos.

## Runtime

La app solo usa el `service_role` key, server-side (`src/lib/supabase/server.ts`),
nunca el cliente en el navegador. No hay RLS configurado todavía porque no
hay auth ni multi-tenancy (un solo usuario demo) — ver "Pendiente" en
[`ARCHITECTURE.md`](./ARCHITECTURE.md) para lo que falta antes de soportar
usuarios reales.
