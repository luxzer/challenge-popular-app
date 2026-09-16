"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, SegmentedBar, money, moneyCents, parseLocalDate } from "./ui";
import { AS_OF_MONTH_LABEL, PREVIOUS_MONTH_LABEL } from "@/lib/data";
import { getCategoryBreakdown, getCategoryRemainder, getTransactionsForCategory, getTotalGastos } from "@/lib/score";

const TONE_TEXT: Record<string, string> = {
  danger: "text-danger",
  success: "text-success",
  warning: "text-warning",
  neutral: "text-muted",
};

export function ExpenseBreakdown() {
  const breakdown = getCategoryBreakdown().filter((b) => b.category.id !== "otros");
  const total = getTotalGastos();
  const [sectionOpen, setSectionOpen] = useState(false);
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);

  return (
    <Card>
      <button
        type="button"
        onClick={() => setSectionOpen((v) => !v)}
        className="flex w-full items-baseline justify-between"
      >
        <h2 className="text-[17px] font-bold text-ink">Análisis de gastos</h2>
        <span className="flex items-center gap-1.5 text-sm text-muted">
          {AS_OF_MONTH_LABEL} · {money(total)}
          <span className="text-brand-orange">{sectionOpen ? "^" : "v"}</span>
        </span>
      </button>

      <div className="mt-3">
        <SegmentedBar segments={breakdown.map((b) => ({ pct: b.pct, color: b.category.colorVar }))} />
      </div>

      <div className="mt-1 divide-y divide-divider">
        {breakdown.map((b) => {
          const isOpen = openCategoryId === b.category.id;
          const transactions = getTransactionsForCategory(b.category.id);
          const remainder = getCategoryRemainder(b.category.id);

          if (!sectionOpen) {
            return (
              <div key={b.category.id} className="flex items-center justify-between py-3">
                <span className="flex items-center gap-2 text-[15px] text-ink">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: b.category.colorVar }} />
                  {b.category.name}
                </span>
                <span className="font-bold text-ink">{b.pct}%</span>
              </div>
            );
          }

          return (
            <div key={b.category.id}>
              <button
                type="button"
                onClick={() => setOpenCategoryId(isOpen ? null : b.category.id)}
                className="flex w-full items-center gap-3 py-3 text-left"
              >
                <span className="flex items-center gap-2 text-[15px] text-ink">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: b.category.colorVar }} />
                  {b.category.name}
                </span>
                <span className="flex-1" />
                <span className="text-right">
                  <span className="block font-bold text-ink">{money(b.amount)}</span>
                  {b.category.insight ? (
                    <span className={`block text-xs ${TONE_TEXT[b.category.insightTone ?? "neutral"]}`}>
                      {b.category.insight}
                    </span>
                  ) : null}
                </span>
                <span className="text-brand-orange">{isOpen ? "^" : "v"}</span>
              </button>

              {isOpen ? (
                <div className="pb-3">
                  <div className="space-y-3">
                    {transactions.map((t) => (
                      <div key={t.id} className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-danger-bg text-danger">
                          ↗
                        </span>
                        <span className="flex-1">
                          <span className="block text-[15px] text-ink">{t.merchant}</span>
                          <span className="block text-xs text-muted">
                            {parseLocalDate(t.date).toLocaleDateString("es-DO", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </span>
                        <span className="text-danger font-semibold">-{moneyCents(t.amount)}</span>
                      </div>
                    ))}
                    {remainder ? (
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-page text-muted">
                          •••
                        </span>
                        <span className="flex-1 text-[15px] text-muted">
                          Otras {remainder.count} compras en {b.category.name.toLowerCase()}
                        </span>
                        <span className="text-muted font-semibold">-{moneyCents(remainder.amount)}</span>
                      </div>
                    ) : null}
                  </div>
                  {b.category.id === "delivery" ? (
                    <p className="mt-3 rounded-2xl bg-page px-4 py-3 text-sm text-ink-soft">
                      Tres pedidos por semana en promedio. Con una tarjeta de 5% en comida rápida
                      recuperarías RD$459 de este mes.
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {!sectionOpen ? (
        <button
          type="button"
          onClick={() => {
            setSectionOpen(true);
            setOpenCategoryId("delivery");
          }}
          className="mt-1 w-full rounded-2xl bg-page px-4 py-3 text-left text-sm text-ink-soft"
        >
          Gastaste <strong>{money(9190)}</strong> en delivery este {AS_OF_MONTH_LABEL.toLowerCase()}, 41%
          más que en {PREVIOUS_MONTH_LABEL}. Toca para ver el detalle.
        </button>
      ) : (
        <Link
          href="/salud-financiera/recomendaciones"
          className="mt-3 flex items-center justify-between text-[15px] font-bold text-ink"
        >
          Qué hacer con estos gastos
          <span className="text-brand-orange">›</span>
        </Link>
      )}
    </Card>
  );
}
