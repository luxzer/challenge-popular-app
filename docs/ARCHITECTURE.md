# Arquitectura

## Stack

Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind CSS v4. Sin base
de datos: todo el estado del diagnóstico se computa en el servidor a partir
de datos mock deterministas en `src/lib/`. Ver [`DATA.md`](./DATA.md) para el
detalle de qué es real y qué es sintético.

## Shell de la app

La app simula un teléfono dentro del navegador (útil para una demo en
desktop sin perder el contexto de "app móvil"):

- `src/app/salud-financiera/layout.tsx` — el frame: en desktop centra un
  rectángulo de ~430px con bordes redondeados y sombra; en móvil ocupa toda
  la pantalla. Dentro, un contenedor con scroll propio + `BottomNav` fijo.
- `src/components/AppHeader.tsx` — header con gradiente navy→azul, botón
  atrás, título/subtítulo, y un slot `children` para contenido extra (ej. el
  saludo "Hola, Luis" en el dashboard).
- `src/components/StatusBar.tsx` — barra de estado falsa (hora real del
  dispositivo del usuario vía `Date()`, batería/señal estáticas).
- `src/components/BottomNav.tsx` — tab bar (Resumen/Score/Recomendaciones/
  Aliado), resalta la ruta activa con `usePathname`.

## Páginas

| Ruta | Qué hace |
|---|---|
| `/salud-financiera` | Dashboard: gauge del score, gastos con acordeón de dos niveles, "Para ti", CTA a Aliado |
| `/salud-financiera/score` | Desglose de los 5 factores ponderados del score |
| `/salud-financiera/recomendaciones` | Tarjetas top + "otras tarjetas", acciones sugeridas, con filtros |
| `/salud-financiera/aliado` | Chat con el asistente |
| `/api/aliado` | Route handler que llama a la API de Gemini |

Las páginas de dashboard/score/recomendaciones son Server Components (leen
los datos mock directamente, sin fetch); los pedacitos interactivos
(acordeón de gastos, tabs de filtro, el chat) son Client Components
aislados (`ExpenseBreakdown`, `RecommendationsTabs`, `aliado/page.tsx`).

## Motor de score (`src/lib/score.ts`)

El score **no está hardcodeado**: se calcula desde un objeto de señales mock
(`ACCOUNT_SIGNALS`) que simula lo que vendría de sistemas core del banco
(motor de pagos, utilización de crédito, nómina, productos). Cada señal se
mapea a un puntaje 0-100 por factor (`computeScoreFactors`), y
`computeOverallScore` calcula un promedio ponderado (30/25/20/15/10) escalado
a un rango 300-850 (estilo score crediticio). Cambiar `ACCOUNT_SIGNALS` es
suficiente para mover el score completo de forma consistente en todas las
pantallas.

Los gastos por categoría (`CATEGORY_TOTALS`) son la fuente de verdad para el
total mensual; las transacciones individuales (`TRANSACTIONS` en `data.ts`)
son una vista "reciente" que no necesariamente suma el total exacto — la
diferencia se muestra explícitamente como una fila "Otras N compras" 
(`getCategoryRemainder`) en vez de dejar un número que no cuadra.

## Recomendaciones de tarjetas (`src/lib/cards-data.ts` + `recommendations.ts`)

Los datos de las 10 tarjetas de Popular (cashback, costo anual, ingreso
mínimo, beneficios) vienen tal cual de `/cards/cards.md` (comparativa real de
EfiCredit) — no se inventan cifras. `getRecommendedCards()` separa las
tarjetas marcadas "Top Recomendada" de las "Estándar", y calcula un
`matchNote` dinámico ("Cubre tu 38% en delivery y comida rápida") cruzando
`matchCategoryIds` de cada tarjeta contra el desglose de gastos real del
usuario — si cambian los gastos, el texto de match cambia solo.

## Asistente Aliado (`src/lib/aliado-context.ts` + `src/app/api/aliado/route.ts`)

Patrón "grounded, no free-form": en cada request, el route handler arma un
JSON con el diagnóstico completo del usuario (score, factores, gastos,
tarjetas recomendadas, acciones sugeridas) vía `buildAliadoContext()`, lo
inyecta como `system_instruction` de Gemini junto con reglas explícitas
("no inventes cifras que no estén en este JSON"), y solo entonces se envía
el historial de la conversación. El modelo nunca tiene acceso a datos crudos
ni a herramientas — todo lo que puede decir ya fue precalculado por el
motor de score/gastos/recomendaciones. Esto es lo que el brief de producto
llama "consulta el diagnóstico ya calculado, evita alucinaciones con datos
financieros sensibles".

## Pendiente

- Pantallas "Metas financieras" y "Simulación de escenarios" del flujo de 10
  pantallas (no había mockups para estas al momento de construir el MVP).
- Persistencia de feedback del usuario (aceptar/ignorar recomendaciones) —
  hoy los botones no tienen efecto; conectar esto es lo que permitiría el
  "ciclo de mejora" descrito en el brief de producto.
- Reemplazar los datos mock por transacciones/señales reales del core
  bancario cuando exista esa integración.
