import { ACTIONS, PREVIOUS_MONTH_LABEL } from "./data";
import { getRecommendedCards } from "./recommendations";
import { computeOverallScore, computeScoreFactors, getCategoryBreakdown, getFinancialHealthSummary } from "./score";

/**
 * Builds the grounded, read-only snapshot of the user's diagnostic that the
 * assistant is allowed to talk about. The model never receives raw account
 * access — only this precomputed JSON — so it can't invent numbers that
 * aren't already shown elsewhere in the module.
 */
export function buildAliadoContext() {
  const summary = getFinancialHealthSummary();
  const factors = computeScoreFactors();
  const score = computeOverallScore(factors);
  const gastos = getCategoryBreakdown();

  return {
    usuario: summary.userFirstName,
    fecha_diagnostico: summary.asOfDate,
    score: {
      valor: score,
      maximo: summary.scoreMax,
      tendencia: summary.scoreTrend,
      variacion_mes_actual_pts: summary.scoreDeltaMonth,
      factores: factors.map((f) => ({
        nombre: f.label,
        peso_pct: f.weightPct,
        estado: f.status,
        detalle: f.detail,
      })),
    },
    resumen: {
      pagos_a_tiempo_pct: summary.onTimePaymentsPct,
      uso_credito_pct: summary.creditUtilizationPct,
      tasa_ahorro_pct: summary.savingsRatePct,
      tasa_ahorro_mes_anterior_pct: 14,
      mes_anterior: PREVIOUS_MONTH_LABEL,
    },
    gastos_mes_actual: gastos.map((g) => ({
      categoria: g.category.name,
      monto: g.amount,
      pct_del_total: g.pct,
      nota: g.category.insight ?? null,
    })),
    tarjetas_recomendadas: getRecommendedCards().topCards.map((c) => ({
      nombre: c.name,
      motivo: c.matchNote,
      ahorro_anual_estimado: c.estimatedAnnualSavings,
      costo_anual: c.annualCost,
      ingreso_minimo: c.minIncome,
    })),
    acciones_sugeridas: ACTIONS.map((a) => ({
      titulo: a.title,
      detalle: a.detail,
      impacto_score_pts: a.scoreImpactPts,
      impacto_dinero: a.moneyImpactLabel,
    })),
  };
}

export function buildSystemInstruction(): string {
  const context = buildAliadoContext();

  return `Eres "Aliado", el asistente conversacional de salud financiera dentro de la app de Banco Popular.

Reglas estrictas:
- Solo puedes hablar sobre los datos del diagnóstico del usuario que se te entregan abajo en JSON. No inventes montos, porcentajes, fechas ni productos que no estén ahí.
- Si te preguntan algo que no se puede responder con estos datos (ej. estimados de mercado, tasas de otras instituciones, consejos legales), dilo con honestidad: no tienes esa información y sugiere revisar la sección correspondiente del módulo o hablar con un asesor.
- Tono: empático, claro, nunca punitivo. Nunca hagas sentir mal al usuario por su situación financiera.
- Respuestas cortas y accionables, en español dominicano neutro. Evita jerga técnica innecesaria.
- Cuando el usuario pregunte por qué su score subió o bajó, compara explícitamente con el mes anterior usando los datos dados.
- No repitas todo el JSON de una vez; responde solo lo que se pregunta.

Diagnóstico actual del usuario (única fuente de verdad):
${JSON.stringify(context, null, 2)}`;
}
