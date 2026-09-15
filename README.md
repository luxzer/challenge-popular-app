# Salud Financiera — Banco Popular (Challenge Popular)

Prototipo del módulo "Salud Financiera": score bancario propio, análisis de
gastos, recomendaciones personalizadas y el asistente conversacional
**Aliado**, integrado a la identidad visual de Banco Popular.

Equipo Los Búhos — Luis Calderón, Daniel Jiménez, Luis Terrero, Jade Elizabeth.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS v4
- Datos mock deterministas (`src/lib/data.ts`, `src/lib/score.ts`) que simulan
  transacciones, pagos y balances ya existentes en el banco
- Asistente **Aliado** vía API de Google Gemini, con el contexto acotado
  únicamente al diagnóstico ya calculado (sin acceso a datos crudos ni
  invención de cifras) — ver `src/lib/aliado-context.ts`

## Cómo correrlo

```bash
npm install
cp .env.example .env.local   # agrega tu GEMINI_API_KEY
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) — redirige a
`/salud-financiera`.

## Variables de entorno

| Variable | Requerida | Descripción |
|---|---|---|
| `GEMINI_API_KEY` | Sí, para el chat | API key de [Google AI Studio](https://aistudio.google.com/apikey) (tiene free tier) |
| `GEMINI_MODEL` | No | Modelo a usar, por defecto `gemini-2.5-flash` |

Sin `GEMINI_API_KEY`, el resto del módulo (dashboard, score, recomendaciones)
funciona normalmente; solo el chat de Aliado mostrará un mensaje de error
indicando que falta configurarla.

## Estructura

```
src/
  app/
    salud-financiera/         Layout con el "frame" de teléfono + tab bar
      page.tsx                Resumen (dashboard, score gauge, gastos, "Para ti")
      score/page.tsx          Desglose del score en 5 factores
      recomendaciones/page.tsx  Tarjetas + acciones sugeridas, con filtros
      aliado/page.tsx         Chat con el asistente
    api/aliado/route.ts       Endpoint que llama a Gemini con contexto acotado
  components/                 AppHeader, BottomNav, ExpenseBreakdown, ui.tsx…
  lib/
    data.ts                   Datos mock (transacciones, tarjetas, acciones)
    score.ts                  Motor de cálculo del score y desglose de gastos
    aliado-context.ts         Construcción del contexto grounded para el chat
```

## Pendiente / próximos pasos

- Pantallas de "Metas financieras" y "Simulación de escenarios" (mencionadas
  en el flujo de 10 pantallas, no incluidas en los mockups iniciales).
- Persistencia real de feedback del usuario (aceptar/ignorar recomendaciones)
  para retroalimentar el sistema, como describe el plan de crecimiento.
- Conectar a datos transaccionales reales en vez del mock determinista.
