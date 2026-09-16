import { cache } from "react";
import { getSupabaseServerClient } from "./supabase/server";
import { ExpenseCategory, PopularCard, SuggestedAction, Transaction } from "./types";

export type AccountSignals = {
  asOfDate: string;
  onTimePayments: number;
  totalPayments: number;
  creditUtilizationPct: number;
  incomeStabilityScore: number;
  monthlyIncome: number;
  productsHeld: number;
  productsInUniverse: number;
  scoreDeltaMonth: number;
  scoreTrend: "En mejora" | "Estable" | "Necesita atención";
};

/** Single-tenant demo: there is exactly one seeded user ("John Doe"), shown
 * through one of several demo profiles — see lib/profile.ts. */
export const getDemoUser = cache(async () => {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.from("app_users").select("id, first_name").limit(1).single();
  if (error) throw new Error(`getDemoUser: ${error.message}`);
  return { id: data.id as string, firstName: data.first_name as string };
});

export const getAccountSignals = cache(async (userId: string, profileId: number): Promise<AccountSignals> => {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("account_signals")
    .select("*")
    .eq("user_id", userId)
    .eq("profile_id", profileId)
    .single();
  if (error) throw new Error(`getAccountSignals: ${error.message}`);
  return {
    asOfDate: data.as_of_date,
    onTimePayments: data.on_time_payments,
    totalPayments: data.total_payments,
    creditUtilizationPct: Number(data.credit_utilization_pct),
    incomeStabilityScore: data.income_stability_score,
    monthlyIncome: Number(data.monthly_income),
    productsHeld: data.products_held,
    productsInUniverse: data.products_in_universe,
    scoreDeltaMonth: data.score_delta_month,
    scoreTrend: data.score_trend,
  };
});

export const getCategories = cache(async (): Promise<ExpenseCategory[]> => {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.from("categories").select("*").order("sort_order");
  if (error) throw new Error(`getCategories: ${error.message}`);
  return data.map((c) => ({
    id: c.id,
    name: c.name,
    colorVar: c.color_var,
  }));
});

function monthStart(isoDate: string) {
  return `${isoDate.slice(0, 7)}-01`;
}

export type CategoryTotal = { amount: number; insight: string | null; insightTone: string | null };

export const getCategoryTotals = cache(
  async (userId: string, profileId: number, isoDate: string): Promise<Record<string, CategoryTotal>> => {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("category_totals")
      .select("category_id, amount, insight, insight_tone")
      .eq("user_id", userId)
      .eq("profile_id", profileId)
      .eq("month", monthStart(isoDate));
    if (error) throw new Error(`getCategoryTotals: ${error.message}`);
    return Object.fromEntries(
      data.map((r) => [
        r.category_id,
        { amount: Number(r.amount), insight: r.insight, insightTone: r.insight_tone },
      ])
    );
  }
);

export const getTransactions = cache(async (userId: string, profileId: number): Promise<Transaction[]> => {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .eq("profile_id", profileId)
    .order("occurred_on", { ascending: false });
  if (error) throw new Error(`getTransactions: ${error.message}`);
  return data.map((t) => ({
    id: t.id,
    merchant: t.merchant,
    date: t.occurred_on,
    amount: Number(t.amount),
    categoryId: t.category_id,
  }));
});

export const getCategoryRemainders = cache(
  async (userId: string, profileId: number, isoDate: string): Promise<Record<string, number>> => {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("category_remainders")
      .select("category_id, extra_count")
      .eq("user_id", userId)
      .eq("profile_id", profileId)
      .eq("month", monthStart(isoDate));
    if (error) throw new Error(`getCategoryRemainders: ${error.message}`);
    return Object.fromEntries(data.map((r) => [r.category_id, r.extra_count]));
  }
);

export const getSuggestedActions = cache(async (userId: string): Promise<SuggestedAction[]> => {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("suggested_actions")
    .select("*")
    .eq("user_id", userId)
    .order("sort_order");
  if (error) throw new Error(`getSuggestedActions: ${error.message}`);
  return data.map((a) => ({
    id: a.id,
    title: a.title,
    detail: a.detail,
    scoreImpactPts: a.score_impact_pts,
    moneyImpactLabel: a.money_impact_label,
    primaryCta: a.primary_cta,
    secondaryCta: a.secondary_cta,
    direction: a.direction,
    category: a.category,
  }));
});

export const getCards = cache(async (): Promise<PopularCard[]> => {
  const supabase = getSupabaseServerClient();
  const [{ data: cards, error }, { data: items, error: itemsError }] = await Promise.all([
    supabase.from("cards").select("*").order("sort_order"),
    supabase.from("card_cashback_items").select("*").order("sort_order"),
  ]);
  if (error) throw new Error(`getCards: ${error.message}`);
  if (itemsError) throw new Error(`getCards (cashback items): ${itemsError.message}`);

  return cards.map((c) => ({
    id: c.id,
    name: c.name,
    issuer: c.issuer,
    network: c.network,
    badge: c.badge,
    badgeLabel: c.badge_label,
    estimatedAnnualSavings: Number(c.estimated_annual_savings),
    annualCost: c.annual_cost,
    minIncome: c.min_income,
    redemption: c.redemption,
    preaprobada: c.preaprobada ?? false,
    perks: c.perks ?? [],
    imagePath: c.image_path,
    matchCategoryIds: c.match_category_ids ?? [],
    cashback: items
      .filter((i) => i.card_id === c.id)
      .map((i) => ({ label: i.label, limit: i.limit_label, estimatedAnnualSavings: i.estimated_savings_label })),
  }));
});
