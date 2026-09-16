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
- [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) — cómo se despliega y variables de entorno

## Quickstart

```bash
npm install
cp .env.example .env.local   # agrega tu GEMINI_API_KEY
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) — redirige a
`/salud-financiera`.

Sin `GEMINI_API_KEY`, todo el módulo funciona normalmente excepto el chat de
Aliado, que muestra un error claro en vez de romperse. Ver
[`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) para el resto de las variables.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- Datos mock deterministas que simulan transacciones, pagos y balances ya
  existentes en el banco, más el comparador real de tarjetas Popular
  (`/cards/cards.md`, datos de EfiCredit)
- Asistente **Aliado** vía API de Google Gemini, acotado al diagnóstico ya
  calculado del usuario (sin acceso a datos crudos ni invención de cifras)
- Desplegado en Netlify (build + funciones serverless para el chat)
