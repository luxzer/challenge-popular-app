# De dónde sale cada dato

Este documento existe para que nadie confunda un número de demo con un dato
real, y para que sea fácil auditar/actualizar cuando haya una fuente real
que lo reemplace.

## Real (viene de una fuente documentada)

**Las 10 tarjetas de Popular** (`src/lib/cards-data.ts`) — cashback, costo
anual, ingreso mínimo, forma de canje y beneficios copiados tal cual de
`/cards/cards.md` (comparativa de EfiCredit, actualizada 04 jun 2025). Donde
la fuente dice "A calcular" se deja así — no se inventó ningún estimado
por categoría que la fuente no daba. Las imágenes de las tarjetas
(`/cards/*.png` → `public/cards/`) son las artes reales entregadas; las 5
tarjetas sin arte (Clásica Visa/Mastercard, Clásica Internacional
Visa/Mastercard, Almacenes Iberia) usan un placeholder con el nombre de la
red (Visa/Mastercard).

## Sintético (mock determinista, para que la demo tenga números consistentes)

**Usuario, transacciones y señales de cuenta** (`src/lib/data.ts`,
`ACCOUNT_SIGNALS` en `src/lib/score.ts`) — no hay un usuario real "Luis"
detrás; todo es un perfil de ejemplo diseñado para producir un score ~682,
una tasa de ahorro del 8%, y un gasto de agosto de RD$24,180 con delivery
como categoría problemática (41% más que julio). Los cálculos son reales
(ver abajo), los insumos son de ejemplo.

### Cómo se deriva cada número del dashboard

| Dato mostrado | Cómo se calcula |
|---|---|
| Score (682/850) | Promedio ponderado de 5 factores (30/25/20/15/10%), escalado de 0-100 a 300-850. Ver `computeOverallScore` |
| Pagos a tiempo (100%) | `onTimePayments / totalPayments` de `ACCOUNT_SIGNALS` |
| Uso del crédito (19%) | Directo de `ACCOUNT_SIGNALS.creditUtilizationPct` |
| Tasa de ahorro (8%) | `(monthlyIncome - gastoTotalMes) / monthlyIncome`, ver `getSavingsRatePct` |
| % de cada categoría de gasto | `montoCategoria / gastoTotalMes`, ver `getCategoryBreakdown` |
| "Otras N compras" en una categoría | `totalCategoria - suma(transaccionesMostradas)`, ver `getCategoryRemainder` — así el detalle de transacciones nunca contradice el total declarado |
| Match de tarjetas ("Cubre tu X% en...") | Suma de `pct` de las categorías de gasto que la tarjeta cubre (`matchCategoryIds`), ver `getRecommendedCards` |

### Por qué el score da ~682 y no otro número

Es el resultado de señales elegidas a mano para que el ejemplo se sienta
realista (alguien con buen historial de pagos pero baja capacidad de
ahorro), no una cifra fija escrita en la UI. Cambiar cualquier valor en
`ACCOUNT_SIGNALS` (por ejemplo `creditUtilizationPct` o `monthlyIncome`)
recalcula el score, sus 5 factores, y el texto del chat de Aliado de forma
consistente — no hay que tocar la UI.

## Reglas para agregar datos nuevos

1. Si el dato existe en una fuente real (un doc, una captura, un csv), va en
   su propio archivo bajo `src/lib/*-data.ts` citando la fuente en un
   comentario, igual que `cards-data.ts`.
2. Si es un insumo de ejemplo (mock), va en `ACCOUNT_SIGNALS` o `data.ts`, y
   cualquier número derivado se calcula con una función pura en `score.ts` /
   `recommendations.ts` — nunca se hardcodea el resultado en un componente.
3. Nunca se inventa un estimado que la fuente no da (ver "A calcular" en las
   tarjetas): es preferible mostrar honestamente que falta el dato a
   fabricar un número.
