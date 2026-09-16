# Deployment

## Sitio en vivo

- **URL:** https://challenge-popular-app.netlify.app
- **Site ID:** `ae1425fd-a0c8-430b-af3e-ac1d5e1d33f6`
- **Cuenta Netlify:** `luxzer` (team "Whim")
- Enlazado localmente vía `netlify link` (ver `.netlify/state.json`, no se
  commitea).

## Variables de entorno en Netlify

Configuradas (`netlify env:list` para verlas):

- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — ya seteadas, el módulo lee
  todo su contenido de la base de datos real. Ver [`DATABASE.md`](./DATABASE.md).

Pendiente:

- `GEMINI_API_KEY` — **no está configurada todavía**. El resto del módulo
  funciona perfecto, pero el chat de Aliado muestra el error "Falta
  configurar GEMINI_API_KEY" hasta que se agregue:

```bash
netlify env:set GEMINI_API_KEY "tu-api-key-de-google-ai-studio"
netlify deploy --prod   # o el siguiente push/redeploy la recoge sola
```

(`GEMINI_MODEL` es opcional, por defecto usa `gemini-2.5-flash`.)

## Cómo redesplegar

```bash
netlify deploy --build --prod
```

Esto corre `npm run build` y publica con el plugin `@netlify/plugin-nextjs`
(configurado en `netlify.toml`).

## ⚠️ Bug conocido: build local en Windows

El plugin `@netlify/plugin-nextjs` (OpenNext para Netlify) falla al publicar
en Windows nativo con:

```
Plugin "@netlify/plugin-nextjs" failed
Error: Failed publishing static content
```

**Causa:** en `dist/build/content/static.js`, la función `publishStaticDir`
usa `fs.rename()` para "intercambiar" el directorio `.next` publicado por el
nuevo build. `fs.rename` en Windows falla al renombrar un directorio hacia
un destino que ya existe (aunque esté vacío) — algo que sí funciona en
Linux/macOS, que es donde este plugin se prueba normalmente (incluyendo los
servidores de build de Netlify, que corren Linux).

**Fix aplicado (temporal, local):** se parcheó manualmente ese archivo
(instalado en `.netlify/plugins/node_modules/@netlify/plugin-nextjs/dist/build/content/static.js`,
que está gitignored) para reemplazar los `rename()` por `cp()` + `rm()`,
que sí funcionan igual en cualquier SO:

```js
var publishStaticDir = async (ctx) => {
  try {
    await rm(ctx.tempPublishDir, { recursive: true, force: true });
    await cp(ctx.publishDir, ctx.tempPublishDir, { recursive: true });
    await rm(ctx.publishDir, { recursive: true, force: true });
    await cp(ctx.staticDir, ctx.publishDir, { recursive: true });
  } catch (error) {
    ctx.failBuild("Failed publishing static content", error instanceof Error ? { error } : {});
  }
};
```

**Este parche se pierde** cada vez que Netlify CLI reinstala el plugin (por
ejemplo, si se borra `.netlify/plugins` o se actualiza la versión). Si el
build local en Windows vuelve a fallar con el mismo error, hay que
reaplicar este parche a mano, o alternativamente:

- Correr el build/deploy dentro de WSL (Linux) en vez de Windows nativo, o
- Conectar el sitio directamente a GitHub para que Netlify construya en sus
  propios servidores Linux (recomendado a mediano plazo — evita este
  problema por completo y da CI/CD automático en cada push).

## Deploy conectado a GitHub (pendiente)

Hoy el deploy es manual (`netlify deploy --build --prod` desde esta
máquina). El repo ya existe en `github.com/luxzer/challenge-popular-app`
con `origin` configurado. Conectar el sitio de Netlify a ese repo (Site
settings → Build & deploy → Link repository) daría deploy automático en
cada push a `main` y evitaría el bug de Windows de la sección anterior, ya
que el build correría en los servidores Linux de Netlify.
