export type Transaction = {
  id: string;
  merchant: string;
  date: string; // ISO date
  amount: number; // positive = expense, in DOP
  categoryId: string;
};

export type ExpenseCategory = {
  id: string;
  name: string;
  colorVar: string; // css color token used for legend swatch + bar segment
  insight?: string;
  insightTone?: "danger" | "success" | "warning" | "neutral";
};

export type ScoreFactorId =
  | "historial_pagos"
  | "uso_credito"
  | "estabilidad_ingresos"
  | "capacidad_ahorro"
  | "diversidad_productos";

export type ScoreFactorStatus = "Excelente" | "Bueno" | "Mejorable" | "Bajo";

export type ScoreFactor = {
  id: ScoreFactorId;
  label: string;
  weightPct: number;
  status: ScoreFactorStatus;
  fillPct: number; // 0-100, visual strength of this factor
  detail: string;
};

export type FinancialHealthSummary = {
  userFirstName: string;
  asOfDate: string; // display date e.g. "27 de agosto, 2026"
  asOfDateIso: string; // "2026-08-27"
  score: number;
  scoreMax: number;
  scoreDeltaMonth: number;
  scoreTrend: "En mejora" | "Estable" | "En riesgo";
  onTimePaymentsPct: number;
  creditUtilizationPct: number;
  savingsRatePct: number;
};

export type SuggestedAction = {
  id: string;
  title: string;
  detail: string;
  scoreImpactPts: number;
  moneyImpactLabel: string;
  primaryCta: string;
  secondaryCta: string;
  direction: "up" | "down";
  category: "deuda" | "ahorro" | "tarjetas";
};

export type CashbackItem = {
  label: string;
  limit: string;
  estimatedAnnualSavings: string;
};

export type PopularCard = {
  id: string;
  name: string;
  issuer: string;
  network: "Visa" | "Mastercard";
  badge: "top" | "estandar";
  badgeLabel: string;
  estimatedAnnualSavings: number;
  annualCost: string;
  minIncome: string;
  redemption: string;
  cashback: CashbackItem[];
  perks?: string[];
  imagePath: string | null;
  /** Ids from the categories table this card's cashback meaningfully covers,
   * used to compute a live "Cubre tu X% en..." match note from real spend. */
  matchCategoryIds?: string[];
};
