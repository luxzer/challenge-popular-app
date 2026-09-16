# Arquitectura

## Stack

Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind CSS v4, con
**Supabase (Postgres)** como base de datos. Todas las páginas del módulo son
Server Components async que consultan la base de datos en cada request
(`export const dynamic = "force-dynamic"`), y los datos derivados (score,
desglose de gastos, match de tarjetas) se calculan en el servidor a partir
de esas filas. Ver [`DATA.md`](./DATA.md) para el detalle de qué tabla
alimenta cada número en pantalla, y qué sigue siendo un dato de ejemplo
("mock") frente a uno real.

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

Cada página es un Server Component `async` que consulta Supabase y le pasa
los datos ya resueltos (plain objects, no promesas) a Client Components
puramente presentacionales:

- `ExpenseBreakdown` recibe `breakdown`, `totalGastos`, `monthLabel` y un
  mapa `detailsByCategory` (transacciones + remainder por categoría) ya
  resueltos — el componente solo maneja el estado de UI (qué está
  expandido), no hace fetching.
- `RecommendationsTabs` recibe `topCards`, `otherCards` y `actions` como
  props; solo el filtro de tabs es estado local.
- `aliado/page.tsx` (Server Component) obtiene el resumen inicial y lo pasa
  a `AliadoChat` (Client Component), que desde ahí maneja la conversación
  hablando con `/api/aliado`.

## Capa de datos (`src/lib/db.ts`)

Un único cliente Supabase server-only (`src/lib/supabase/server.ts`, usa el
`service_role` key — **nunca** se importa desde un Client Component) y un
set de funciones de consulta envueltas en `cache()` de React, que dedupea
llamadas idénticas dentro del mismo render (por ejemplo, tanto
`computeScoreFactors()` como `getFinancialHealthSummary()` piden las mismas
`account_signals`, pero solo se hace un round-trip):

`getDemoUser`, `getAccountSignals`, `getCategories`, `getCategoryTotals`,
`getTransactions`, `getCategoryRemainders`, `getSuggestedActions`, `getCards`.

La app es de un solo usuario (sin auth todavía — ver "Pendiente" abajo), así
que estas funciones no reciben un `userId` externo salvo cuando ya se
obtuvo de `getDemoUser()`.

## Motor de score (`src/lib/score.ts`)

El score **no está hardcodeado**: `computeScoreFactors()` lee
`account_signals` (una fila por usuario: pagos a tiempo, utilización de
crédito, estabilidad de ingresos, ingreso mensual, productos) y mapea cada
señal a un puntaje 0-100 por factor. `computeOverallScore` calcula un
promedio ponderado (30/25/20/15/10) escalado a un rango 300-850 (estilo
score crediticio). Cambiar una fila en `account_signals` mueve el score
completo de forma consistente en todas las pantallas — no hay que tocar la
UI ni el motor.

Los gastos por categoría (`category_totals`) son la fuente de verdad para
el total mensual; las transacciones individuales (`transactions`) son una
vista "reciente" que no necesariamente suma el total exacto — la diferencia
se muestra explícitamente como una fila "Otras N compras"
(`getCategoryRemainder`, usando `category_remainders`) en vez de dejar un
número que no cuadra.

## Recomendaciones de tarjetas (`src/lib/recommendations.ts`)

Los datos de las 10 tarjetas de Popular (tabla `cards` + `card_cashback_items`)
vienen tal cual de `/cards/cards.md` (comparativa real de EfiCredit) — no se
inventan cifras; ver `scripts/seed.mjs` para el seed exacto y su fuente.
`getRecommendedCards()` separa las tarjetas marcadas "Top Recomendada" de
las "Estándar", y calcula un `matchNote` dinámico ("Cubre tu 38% en delivery
y comida rápida") cruzando `match_category_ids` de cada tarjeta contra el
desglose de gastos real del usuario — si cambian los gastos en la base de
datos, el texto de match cambia solo.

## Asistente Aliado (`src/lib/aliado-context.ts` + `src/app/api/aliado/route.ts`)

Patrón "grounded, no free-form": en cada request, el route handler arma un
JSON con el diagnóstico completo del usuario (score, factores, gastos,
tarjetas recomendadas, acciones sugeridas — todo leído de Supabase) vía
`buildAliadoContext()`, lo inyecta como `system_instruction` de Gemini junto
con reglas explícitas ("no inventes cifras que no estén en este JSON"), y
solo entonces se envía el historial de la conversación. El modelo nunca
tiene acceso directo a la base de datos ni a herramientas — todo lo que
puede decir ya fue precalculado por el motor de score/gastos/recomendaciones.
Esto es lo que el brief de producto llama "consulta el diagnóstico ya
calculado, evita alucinaciones con datos financieros sensibles".

## Pendiente

- Autenticación / multi-tenant real. Hoy `getDemoUser()` siempre devuelve el
  único usuario sembrado ("Luis"); no hay Auth de Supabase ni RLS todavía.
  Para un producto real, cada tabla de usuario necesitaría RLS con
  `auth.uid()` y las queries deberían usar el cliente `anon` + sesión del
  usuario, no el `service_role` desde el servidor.
- Pantallas "Metas financieras" y "Simulación de escenarios" del flujo de 10
  pantallas (no había mockups para estas al momento de construir el MVP).
- Persistencia de feedback del usuario (aceptar/ignorar recomendaciones) —
  ya existe la tabla `user_action_feedback` en el schema, pero los botones
  de la UI todavía no escriben en ella. Conectar esto es lo que permitiría
  el "ciclo de mejora" descrito en el brief de producto.
- Persistir el historial del chat de Aliado (tabla `chat_messages` ya
  existe en el schema, sin usar todavía).
- Reemplazar `transactions`/`account_signals` mock por datos reales del core
  bancario cuando exista esa integración — el resto del código (motor de
  score, recomendaciones, UI) no necesita cambiar.
