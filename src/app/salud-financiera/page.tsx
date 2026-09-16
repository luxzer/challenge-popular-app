import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { CategoryDetail, ExpenseBreakdown } from "@/components/ExpenseBreakdown";
import { LiveUpdatedLabel } from "@/components/LiveUpdatedLabel";
import { Card, Pill, ScoreGauge, money } from "@/components/ui";
import { getDemoUser, getSuggestedActions } from "@/lib/db";
import { getMonthLabel } from "@/lib/format";
import { getRecommendedCards } from "@/lib/recommendations";
import {
  getCategoryBreakdown,
  getCategoryRemainder,
  getFinancialHealthSummary,
  getTransactionsForCategory,
} from "@/lib/score";

export const dynamic = "force-dynamic";

export default async function ResumenPage() {
  const user = await getDemoUser();
  const [summary, actions, { topCards }, breakdown] = await Promise.all([
    getFinancialHealthSummary(),
    getSuggestedActions(user.id),
    getRecommendedCards(),
    getCategoryBreakdown(),
  ]);

  const topAction = actions[0];
  const topCard = topCards.find((c) => c.id === "mastercard-gnial") ?? topCards[0];
  const realCategories = breakdown.filter((b) => b.category.id !== "otros");

  const detailsByCategory: Record<string, CategoryDetail> = {};
  for (const b of realCategories) {
    const [transactions, remainder] = await Promise.all([
      getTransactionsForCategory(b.category.id),
      getCategoryRemainder(b.category.id),
    ]);
    detailsByCategory[b.category.id] = {
      transactions,
      remainder,
      note:
        b.category.id === "delivery"
          ? "Tres pedidos por semana en promedio. Con una tarjeta de 5% en comida rápida recuperarías RD$459 de este mes."
          : undefined,
    };
  }

  return (
    <div className="pb-8">
      <AppHeader title="Salud Financiera" subtitle={<LiveUpdatedLabel />} backHref="/">
        <div className="mt-4">
          <h2 className="text-2xl font-bold text-white">Hola, {summary.userFirstName}</h2>
          <p className="mt-1 text-sm text-white/85">Tu diagnóstico al {summary.asOfDate}</p>
        </div>
      </AppHeader>

      <div className="-mt-5 space-y-4 px-5">
        <Card className="pt-6">
          <ScoreGauge score={summary.score} max={summary.scoreMax} />
          <div className="mt-2 flex justify-center">
            <Pill tone="success">En mejora · +{summary.scoreDeltaMonth} pts este mes</Pill>
          </div>

          <div className="mt-6 grid grid-cols-3 divide-x divide-divider border-t border-divider pt-5 text-center">
            <div>
              <p className="text-lg font-bold text-ink">{summary.onTimePaymentsPct}%</p>
              <p className="text-xs text-muted">Pagos a tiempo</p>
            </div>
            <div>
              <p className="text-lg font-bold text-ink">{summary.creditUtilizationPct}%</p>
              <p className="text-xs text-muted">Uso del crédito</p>
            </div>
            <div>
              <p className="text-lg font-bold text-brand-orange">{summary.savingsRatePct}%</p>
              <p className="text-xs text-muted">Tasa de ahorro</p>
            </div>
          </div>

          <Link
            href="/salud-financiera/score"
            className="mt-4 block text-center text-[15px] font-bold text-brand-orange"
          >
            Ver cómo se calcula ›
          </Link>
        </Card>

        <ExpenseBreakdown
          breakdown={realCategories}
          totalGastos={breakdown.reduce((sum, b) => sum + b.amount, 0)}
          monthLabel={getMonthLabel(summary.asOfDateIso)}
          detailsByCategory={detailsByCategory}
        />

        <Card>
          <div className="flex items-baseline justify-between">
            <h2 className="text-[17px] font-bold text-ink">Para ti</h2>
            <Link href="/salud-financiera/recomendaciones" className="text-sm font-bold text-brand-orange">
              Ver todas ›
            </Link>
          </div>

          <div className="mt-3 divide-y divide-divider">
            {topAction ? (
              <div className="flex items-center gap-3 py-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-page text-ink">
                  ↑
                </span>
                <span className="flex-1 text-[15px] text-ink">{topAction.title}</span>
                <span className="text-sm font-bold text-success">+{topAction.scoreImpactPts} pts</span>
              </div>
            ) : null}
            {topCard ? (
              <div className="flex items-center gap-3 py-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-warning-bg text-warning">
                  %
                </span>
                <span className="flex-1 text-[15px] text-ink">
                  Una tarjeta con 5% en comida rápida se ajusta a tu consumo
                </span>
                <span className="text-sm font-bold text-success">{money(topCard.estimatedAnnualSavings)}</span>
              </div>
            ) : null}
          </div>
        </Card>

        <Link
          href="/salud-financiera/aliado"
          className="flex items-center gap-3 rounded-3xl px-5 py-4 text-white"
          style={{ background: "linear-gradient(160deg, var(--brand-navy-deep) 0%, var(--brand-blue) 100%)" }}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
            <PieIcon />
          </span>
          <span className="flex-1">
            <span className="block text-[16px] font-bold">Pregúntale a Aliado</span>
            <span className="block text-sm text-white/80">Responde con tus propios datos, no con estimados</span>
          </span>
          <span className="text-brand-orange text-xl">›</span>
        </Link>
      </div>
    </div>
  );
}

function PieIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.8" />
      <path d="M12 12V3a9 9 0 0 1 9 9Z" fill="white" />
    </svg>
  );
}
