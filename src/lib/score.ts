import {
  getAccountSignals,
  getCategories,
  getCategoryRemainders,
  getCategoryTotals,
  getDemoUser,
  getTransactions,
} from "./db";
import { formatAsOfDate } from "./format";
import { getActiveProfileId } from "./profile";
import { CategoryBreakdownItem, FinancialHealthSummary, ScoreFactor, ScoreFactorStatus, Transaction } from "./types";

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
export const SCORE_MAX_VALUE = SCORE_MAX;

async function loadUserAndProfile() {
  const [user, profileId] = await Promise.all([getDemoUser(), getActiveProfileId()]);
  return { user, profileId };
}

export async function getTotalGastos(): Promise<number> {
  const { user, profileId } = await loadUserAndProfile();
  const signals = await getAccountSignals(user.id, profileId);
  const totals = await getCategoryTotals(user.id, profileId, signals.asOfDate);
  return Object.values(totals).reduce((sum, t) => sum + t.amount, 0);
}

export function getSavingsRatePctFrom(monthlyIncome: number, gastos: number): number {
  const savings = monthlyIncome - gastos;
  return Math.max(Math.round((savings / monthlyIncome) * 100), 0);
}

export async function computeScoreFactors(): Promise<ScoreFactor[]> {
  const { user, profileId } = await loadUserAndProfile();
  const signals = await getAccountSignals(user.id, profileId);
  const totalGastos = await getTotalGastos();
  const savingsRatePct = getSavingsRatePctFrom(signals.monthlyIncome, totalGastos);

  const historialScore = Math.round((signals.onTimePayments / signals.totalPayments) * 100);
  const usoCreditoScore = utilizationToScore(signals.creditUtilizationPct);
  const estabilidadScore = signals.incomeStabilityScore;
  const ahorroScore = Math.min(Math.round(savingsRatePct * 3.3), 100);
  const diversidadScore = Math.round((signals.productsHeld / signals.productsInUniverse) * 100);

  return [
    {
      id: "historial_pagos",
      label: "Historial de pagos",
      weightPct: FACTOR_WEIGHTS.historial_pagos,
      status: statusForScore(historialScore),
      fillPct: historialScore,
      detail: `${signals.onTimePayments} de ${signals.totalPayments} pagos a tiempo en los últimos 12 meses, incluyendo tu tarjeta ****1122 y tus servicios domiciliados.`,
    },
    {
      id: "uso_credito",
      label: "Uso del crédito",
      weightPct: FACTOR_WEIGHTS.uso_credito,
      status: statusForScore(usoCreditoScore),
      fillPct: usoCreditoScore,
      detail: `Usas en promedio el ${signals.creditUtilizationPct}% de tu límite disponible. Mantenerlo por debajo del 30% ayuda a que este factor se mantenga saludable.`,
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
      detail: `Este mes ahorraste ${savingsRatePct}% de lo que entró a tus cuentas.`,
    },
    {
      id: "diversidad_productos",
      label: "Diversidad de productos",
      weightPct: FACTOR_WEIGHTS.diversidad_productos,
      status: statusForScore(diversidadScore),
      fillPct: diversidadScore,
      detail: `Tienes ${signals.productsHeld} de ${signals.productsInUniverse} tipos de producto con el banco. Sumar uno más, como una cuenta de inversión, sube este factor.`,
    },
  ];
}

export function computeOverallScore(factors: ScoreFactor[]): number {
  const weightedAvg = factors.reduce((sum, f) => sum + (f.fillPct * f.weightPct) / 100, 0);
  const score = SCORE_MIN + (weightedAvg / 100) * (SCORE_MAX - SCORE_MIN);
  return Math.round(score);
}

export async function getFinancialHealthSummary(): Promise<FinancialHealthSummary> {
  const { user, profileId } = await loadUserAndProfile();
  const signals = await getAccountSignals(user.id, profileId);
  const factors = await computeScoreFactors();
  const score = computeOverallScore(factors);
  const totalGastos = await getTotalGastos();

  return {
    userFirstName: user.firstName,
    asOfDate: formatAsOfDate(signals.asOfDate),
    asOfDateIso: signals.asOfDate,
    score,
    scoreMax: SCORE_MAX_VALUE,
    scoreDeltaMonth: signals.scoreDeltaMonth,
    scoreTrend: signals.scoreTrend,
    onTimePaymentsPct: Math.round((signals.onTimePayments / signals.totalPayments) * 100),
    creditUtilizationPct: signals.creditUtilizationPct,
    savingsRatePct: getSavingsRatePctFrom(signals.monthlyIncome, totalGastos),
  };
}

export async function getCategoryBreakdown(): Promise<CategoryBreakdownItem[]> {
  const { user, profileId } = await loadUserAndProfile();
  const signals = await getAccountSignals(user.id, profileId);
  const [categories, totals] = await Promise.all([
    getCategories(),
    getCategoryTotals(user.id, profileId, signals.asOfDate),
  ]);
  const total = Object.values(totals).reduce((sum, t) => sum + t.amount, 0);

  return categories.map((category) => {
    const t = totals[category.id];
    const amount = t?.amount ?? 0;
    return {
      category,
      amount,
      pct: Math.round((amount / total) * 100),
      insight: t?.insight ?? undefined,
      insightTone: (t?.insightTone as CategoryBreakdownItem["insightTone"]) ?? undefined,
    };
  });
}

export async function getTransactionsForCategory(categoryId: string): Promise<Transaction[]> {
  const { user, profileId } = await loadUserAndProfile();
  const all = await getTransactions(user.id, profileId);
  return all.filter((t) => t.categoryId === categoryId);
}

/**
 * The category total (from core banking) minus the recent transactions we
 * show in the drill-down. Real transaction lists are long; the UI only
 * previews the most recent ones, so this reconciles the visible math instead
 * of silently showing a partial sum next to the real total.
 */
export async function getCategoryRemainder(categoryId: string): Promise<{ count: number; amount: number } | null> {
  const { user, profileId } = await loadUserAndProfile();
  const signals = await getAccountSignals(user.id, profileId);
  const [totals, remainders, transactions] = await Promise.all([
    getCategoryTotals(user.id, profileId, signals.asOfDate),
    getCategoryRemainders(user.id, profileId, signals.asOfDate),
    getTransactionsForCategory(categoryId),
  ]);

  const total = totals[categoryId]?.amount;
  if (total === undefined) return null;

  const shownTotal = transactions.reduce((sum, t) => sum + t.amount, 0);
  const remainder = Math.round((total - shownTotal) * 100) / 100;
  if (remainder <= 0.5) return null;

  const count = remainders[categoryId] ?? 0;
  if (count <= 0) return null;

  return { count, amount: remainder };
}
