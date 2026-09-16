import { ACADEMIA_COURSES } from "./academia-courses";
import { getDemoUser, getSuggestedActions } from "./db";
import { getRecommendedCards } from "./recommendations";
import { computeOverallScore, computeScoreFactors, getCategoryBreakdown, getFinancialHealthSummary } from "./score";

/**
 * Builds the grounded, read-only snapshot of the user's diagnostic that the
 * assistant is allowed to talk about. The model never receives raw account
 * access — only this precomputed JSON — so it can't invent numbers that
 * aren't already shown elsewhere in the module.
 */
export async function buildAliadoContext() {
  const user = await getDemoUser();
  const [summary, factors, gastos, { topCards }, actions] = await Promise.all([
    getFinancialHealthSummary(),
    computeScoreFactors(),
    getCategoryBreakdown(),
    getRecommendedCards(),
    getSuggestedActions(user.id),
  ]);
  const score = computeOverallScore(factors);

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
    },
    gastos_mes_actual: gastos.map((g) => ({
      categoria: g.category.name,
      monto: g.amount,
      pct_del_total: g.pct,
      nota: g.insight ?? null,
    })),
    tarjetas_recomendadas: topCards.map((c) => ({
      nombre: c.name,
      motivo: c.matchNote,
      ahorro_anual_estimado: c.estimatedAnnualSavings,
      costo_anual: c.annualCost,
      ingreso_minimo: c.minIncome,
    })),
    acciones_sugeridas: actions.map((a) => ({
      titulo: a.title,
      detalle: a.detail,
      impacto_score_pts: a.scoreImpactPts,
      impacto_dinero: a.moneyImpactLabel,
    })),
    cursos_academia_popular: ACADEMIA_COURSES.map((c) => ({
      titulo: c.title,
      descripcion: c.description,
      nivel: c.level ?? null,
      temas: c.temas,
      link: c.url,
    })),
  };
}

export async function buildSystemInstruction(): Promise<string> {
  const context = await buildAliadoContext();

  return `Eres "Aliado", el asistente conversacional de salud financiera dentro de la app de Banco Popular.

Reglas estrictas:
- Solo puedes hablar sobre los datos del diagnóstico del usuario que se te entregan abajo en JSON. No inventes montos, porcentajes, fechas ni productos que no estén ahí.
- Si te preguntan algo que no se puede responder con estos datos (ej. estimados de mercado, tasas de otras instituciones, consejos legales), dilo con honestidad: no tienes esa información y sugiere revisar la sección correspondiente del módulo o hablar con un asesor.
- Tono: empático, claro, nunca punitivo. Nunca hagas sentir mal al usuario por su situación financiera.
- Respuestas cortas y accionables, en español dominicano neutro. Evita jerga técnica innecesaria.
- Cuando el usuario pregunte por qué su score subió o bajó, usa "variacion_mes_actual_pts" (la variación real de este mes) y las notas de cada categoría de gasto (que ya comparan contra el mes pasado) para explicarlo — nunca inventes una cifra del mes anterior que no esté en esas notas.
- No repitas todo el JSON de una vez; responde solo lo que se pregunta.

Academia Popular (cursos_academia_popular en el JSON):
- Cuando la pregunta del usuario calce con el tema de uno de estos cursos (compara contra el campo "temas" de cada uno), primero responde la pregunta normalmente con sus propios datos, y AL FINAL de tu respuesta agrega una línea aparte recomendando el curso más relevante, con este formato exacto: "Si quieres saber más, ve al curso [título del curso] de la Academia Popular: [link]".
- Nunca recomiendes un curso que no esté en esa lista, y nunca inventes o modifiques un link — usa el campo "link" tal cual viene.
- No agregues la recomendación de curso si la pregunta no tiene relación clara con ningún curso (no la fuerces en cada respuesta).
- Como máximo un curso por respuesta, el más relevante.

Diagnóstico actual del usuario (única fuente de verdad):
${JSON.stringify(context, null, 2)}`;
}
