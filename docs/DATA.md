# De dónde sale cada dato

Este documento existe para que nadie confunda un número de demo con un dato
real, y para que sea fácil auditar/actualizar cuando haya una fuente real
que lo reemplace.

## Base de datos

Todo vive en Supabase (Postgres), proyecto `challenge-popular-app`
(ref `ignrdhgxwfmyyhuonxtw`, organización "Los Buhos"). Schema en
[`supabase/migrations/`](../supabase/migrations), seed reproducible en
[`scripts/seed.mjs`](../scripts/seed.mjs) (`npm run db:seed`).

| Tabla | Qué guarda |
|---|---|
| `app_users` | El único usuario demo ("Luis") |
| `account_signals` | Señales de cuenta usadas por el motor de score (una fila por usuario) |
| `categories` | Las 5 categorías de gasto (delivery, supermercado, transporte, servicios, otros) |
| `category_totals` | Monto gastado por categoría/mes — fuente de verdad del total mensual |
| `transactions` | Transacciones individuales "recientes" mostradas en el drill-down |
| `category_remainders` | Cuántas transacciones adicionales existen más allá de las mostradas, por categoría/mes |
| `cards` + `card_cashback_items` | Las 10 tarjetas de Popular y su cashback por categoría |
| `suggested_actions` | Las acciones sugeridas (automatizar ahorro, abonar tarjeta) |
| `user_action_feedback` | (sin usar aún) aceptar/ignorar una recomendación |
| `chat_messages` | (sin usar aún) historial de conversación con Aliado |

## Real (viene de una fuente documentada)

**Las 10 tarjetas de Popular** (`cards` + `card_cashback_items`) — cashback,
costo anual, ingreso mínimo, forma de canje y beneficios copiados tal cual
de `/cards/cards.md` (comparativa de EfiCredit, actualizada 04 jun 2025).
Donde la fuente dice "A calcular" se deja así — no se inventó ningún
estimado por categoría que la fuente no daba. Las imágenes de las tarjetas
(`/cards/*.png` → `public/cards/`) son las artes reales entregadas; las 5
tarjetas sin arte (Clásica Visa/Mastercard, Clásica Internacional
Visa/Mastercard, Almacenes Iberia) usan un placeholder con el nombre de la
red (Visa/Mastercard).

## Sintético (mock determinista, para que la demo tenga números consistentes)

**Usuario, transacciones y señales de cuenta** (`app_users`,
`account_signals`, `transactions`, `category_totals`) — no hay un usuario
real "Luis" detrás; todo es un perfil de ejemplo diseñado para producir un
score ~682, una tasa de ahorro del 8%, y un gasto de agosto de RD$24,180
con delivery como categoría problemática (41% más que julio). Los cálculos
son reales (ver abajo), los insumos son de ejemplo — ver `scripts/seed.mjs`
para los valores exactos sembrados.

### Cómo se deriva cada número del dashboard

| Dato mostrado | Cómo se calcula |
|---|---|
| Score (682/850) | Promedio ponderado de 5 factores (30/25/20/15/10%), escalado de 0-100 a 300-850. Ver `computeOverallScore` en `score.ts` |
| Pagos a tiempo (100%) | `on_time_payments / total_payments` de `account_signals` |
| Uso del crédito (19%) | Directo de `account_signals.credit_utilization_pct` |
| Tasa de ahorro (8%) | `(monthly_income - gastoTotalMes) / monthly_income`, ver `getSavingsRatePctFrom` |
| % de cada categoría de gasto | `montoCategoria / gastoTotalMes` sobre `category_totals`, ver `getCategoryBreakdown` |
| "Otras N compras" en una categoría | `totalCategoria - suma(transactions mostradas)`, usando `category_remainders.extra_count`, ver `getCategoryRemainder` — así el detalle de transacciones nunca contradice el total declarado |
| Match de tarjetas ("Cubre tu X% en...") | Suma de `pct` de las categorías de gasto que la tarjeta cubre (`cards.match_category_ids`), ver `getRecommendedCards` |

### Por qué el score da ~682 y no otro número

Es el resultado de señales elegidas a mano para que el ejemplo se sienta
realista (alguien con buen historial de pagos pero baja capacidad de
ahorro), no una cifra fija escrita en la UI. Cambiar cualquier valor en la
fila de `account_signals` (por ejemplo `credit_utilization_pct` o
`monthly_income`) recalcula el score, sus 5 factores, y el texto del chat
de Aliado de forma consistente — no hay que tocar la UI.

```sql
update account_signals set monthly_income = 30000 where user_id = '<id>';
```

## Reglas para agregar datos nuevos

1. Si el dato existe en una fuente real (un doc, una captura, un csv), se
   agrega a `scripts/seed.mjs` citando la fuente en un comentario, igual que
   las tarjetas.
2. Si es un insumo de ejemplo (mock), va en `account_signals` o las tablas
   de gasto, y cualquier número derivado se calcula con una función pura en
   `score.ts` / `recommendations.ts` — nunca se hardcodea el resultado en un
   componente.
3. Todo cambio de schema va como un archivo nuevo en
   `supabase/migrations/000N_*.sql` (nunca se edita una migración ya
   aplicada), y se aplica con la Management API o `supabase db push`.
4. Nunca se inventa un estimado que la fuente no da (ver "A calcular" en las
   tarjetas): es preferible mostrar honestamente que falta el dato a
   fabricar un número.
