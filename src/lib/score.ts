import { AS_OF_DATE_DISPLAY, CATEGORIES, TRANSACTIONS, USER_FIRST_NAME } from "./data";
import { FinancialHealthSummary, ScoreFactor, ScoreFactorStatus, Transaction } from "./types";

/**
 * Mock account signals a real integration would pull from core banking systems
 * (payments engine, credit bureau-free internal utilization, payroll deposits,
 * savings sub-accounts, product holdings). Everything downstream is computed
 * from these, not hardcoded, so swapping in real data only means replacing
 * this object.
 */
export const ACCOUNT_SIGNALS = {
  onTimePayments: 18,
  totalPayments: 18,
  creditUtilizationPct: 19,
  incomeStabilityScore: 68, // 0-100, variance of payroll deposits over 12 months
  monthlyIncome: 26280,
  productsHeld: 2,
  productsInUniverse: 5,
};

export const CATEGORY_TOTALS: Record<string, number> = {
  delivery: 9190,
  supermercado: 5320,
  transporte: 3870,
  servicios: 3385,
};

export function getTotalGastos(): number {
  const known = Object.values(CATEGORY_TOTALS).reduce((a, b) => a + b, 0);
  const otros = 24180 - known;
  return known + otros;
}

export function getCategoryBreakdown() {
  const total = getTotalGastos();
  const known = Object.values(CATEGORY_TOTALS).reduce((a, b) => a + b, 0);
  const otros = Math.max(total - known, 0);

  return CATEGORIES.map((cat) => {
    const amount = cat.id === "otros" ? otros : CATEGORY_TOTALS[cat.id] ?? 0;
    return {
      category: cat,
      amount,
      pct: Math.round((amount / total) * 100),
    };
  });
}

export function getTransactionsForCategory(categoryId: string): Transaction[] {
  return TRANSACTIONS.filter((t) => t.categoryId === categoryId).sort((a, b) =>
    a.date < b.date ? 1 : -1
  );
}

export function getSavingsRatePct(gastos: number): number {
  const { monthlyIncome } = ACCOUNT_SIGNALS;
  const savings = monthlyIncome - gastos;
  return Math.max(Math.round((savings / monthlyIncome) * 100), 0);
}

function utilizationToScore(pct: number): number {
  if (pct <= 10) return 90;
  if (pct <= 30) return 70;
  if (pct <= 50) return 50;
  if (pct <= 75) return 30;
  return 10;
}

function statusForScore(score: number): ScoreFactorStatus {
  if (score >= 85) return "Excelente";
  if (score >= 60) return "Bueno";
  if (score >= 25) return "Mejorable";
  return "Bajo";
}

const FACTOR_WEIGHTS = {
  historial_pagos: 30,
  uso_credito: 25,
  estabilidad_ingresos: 20,
  capacidad_ahorro: 15,
  diversidad_productos: 10,
} as const;

const SCORE_MIN = 300;
const SCORE_MAX = 850;

export function computeScoreFactors(): ScoreFactor[] {
  const { onTimePayments, totalPayments, creditUtilizationPct, incomeStabilityScore, productsHeld, productsInUniverse } =
    ACCOUNT_SIGNALS;

  const totalGastos = getTotalGastos();
  const savingsRatePct = getSavingsRatePct(totalGastos);

  const historialScore = Math.round((onTimePayments / totalPayments) * 100);
  const usoCreditoScore = utilizationToScore(creditUtilizationPct);
  const estabilidadScore = incomeStabilityScore;
  const ahorroScore = Math.min(Math.round(savingsRatePct * 3.3), 100);
  const diversidadScore = Math.round((productsHeld / productsInUniverse) * 100);

  const factors: ScoreFactor[] = [
    {
      id: "historial_pagos",
      label: "Historial de pagos",
      weightPct: FACTOR_WEIGHTS.historial_pagos,
      status: statusForScore(historialScore),
      fillPct: historialScore,
      detail: `${onTimePayments} de ${totalPayments} pagos a tiempo en los últimos 12 meses, incluyendo tu tarjeta ****1122 y tus servicios domiciliados. Es tu factor más fuerte.`,
    },
    {
      id: "uso_credito",
      label: "Uso del crédito",
      weightPct: FACTOR_WEIGHTS.uso_credito,
      status: statusForScore(usoCreditoScore),
      fillPct: usoCreditoScore,
      detail: `Usas en promedio el ${creditUtilizationPct}% de tu límite disponible. Mantenerlo por debajo del 30% ayuda a que este factor se mantenga saludable.`,
    },
    {
      id: "estabilidad_ingresos",
      label: "Estabilidad de ingresos",
      weightPct: FACTOR_WEIGHTS.estabilidad_ingresos,
      status: statusForScore(estabilidadScore),
      fillPct: estabilidadScore,
      detail: "Tus depósitos de nómina han sido consistentes en monto y fecha durante los últimos 12 meses.",
    },
    {
      id: "capacidad_ahorro",
      label: "Capacidad de ahorro",
      weightPct: FACTOR_WEIGHTS.capacidad_ahorro,
      status: statusForScore(ahorroScore),
      fillPct: ahorroScore,
      detail: `Este mes ahorraste ${savingsRatePct}% de lo que entró a tus cuentas. Es tu factor con más espacio para mejorar.`,
    },
    {
      id: "diversidad_productos",
      label: "Diversidad de productos",
      weightPct: FACTOR_WEIGHTS.diversidad_productos,
      status: statusForScore(diversidadScore),
      fillPct: diversidadScore,
      detail: `Tienes ${productsHeld} de ${productsInUniverse} tipos de producto con el banco. Sumar uno más, como una cuenta de inversión, sube este factor.`,
    },
  ];

  return factors;
}

export function computeOverallScore(factors: ScoreFactor[]): number {
  const weightedAvg = factors.reduce((sum, f) => sum + (f.fillPct * f.weightPct) / 100, 0);
  const score = SCORE_MIN + (weightedAvg / 100) * (SCORE_MAX - SCORE_MIN);
  return Math.round(score);
}

export const SCORE_DELTA_MONTH = 18;
export const SCORE_MAX_VALUE = SCORE_MAX;

export function getFinancialHealthSummary(): FinancialHealthSummary {
  const factors = computeScoreFactors();
  const score = computeOverallScore(factors);
  const totalGastos = getTotalGastos();

  return {
    userFirstName: USER_FIRST_NAME,
    asOfDate: AS_OF_DATE_DISPLAY,
    score,
    scoreMax: SCORE_MAX_VALUE,
    scoreDeltaMonth: SCORE_DELTA_MONTH,
    scoreTrend: "En mejora",
    onTimePaymentsPct: Math.round((ACCOUNT_SIGNALS.onTimePayments / ACCOUNT_SIGNALS.totalPayments) * 100),
    creditUtilizationPct: ACCOUNT_SIGNALS.creditUtilizationPct,
    savingsRatePct: getSavingsRatePct(totalGastos),
  };
}
