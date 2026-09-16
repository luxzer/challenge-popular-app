"use client";

import Image from "next/image";
import { useState } from "react";
import { Card, Pill, money } from "./ui";
import { ACTIONS } from "@/lib/data";
import { getRecommendedCards } from "@/lib/recommendations";

const FILTERS = [
  { id: "todas", label: "Todas" },
  { id: "deuda", label: "Deuda" },
  { id: "ahorro", label: "Ahorro" },
  { id: "tarjetas", label: "Tarjetas" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

function NetworkBadge({ network }: { network: string }) {
  return (
    <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-xl bg-brand-navy-deep text-xs font-bold text-white">
      {network}
    </div>
  );
}

export function RecommendationsTabs() {
  const [filter, setFilter] = useState<FilterId>("todas");
  const { topCards, otherCards } = getRecommendedCards();

  const showCards = filter === "todas" || filter === "tarjetas";
  const showActions = filter === "todas" || ACTIONS.some((a) => a.category === filter);

  return (
    <div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 pb-4 pt-4">
        {FILTERS.map((f) => {
          const active = f.id === filter;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`shrink-0 rounded-full border px-4 py-2 text-[14px] font-semibold ${
                active
                  ? "border-brand-navy-deep bg-brand-navy-deep text-white"
                  : "border-divider bg-surface text-ink-soft"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-4 px-5 pb-8">
        {showCards ? (
          <>
            <div>
              <h2 className="text-[17px] font-bold text-ink">Tarjetas que se ajustan a tus gastos</h2>
              <p className="mt-1 text-sm text-muted">
                Comparadas contra tu distribución de gastos de los últimos 3 meses.
              </p>
            </div>
            {topCards.map((card) => (
              <Card key={card.id}>
                <div className="flex gap-3">
                  {card.imagePath ? (
                    <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-page">
                      <Image src={card.imagePath} alt={card.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <NetworkBadge network={card.network} />
                  )}
                  <div>
                    <h3 className="text-[16px] font-bold text-ink">{card.name}</h3>
                    <p className="text-sm text-muted">
                      {card.network} · crédito
                    </p>
                  </div>
                </div>

                {card.matchNote ? (
                  <Pill tone="success" className="mt-3 block w-fit text-left">
                    {card.matchNote}
                  </Pill>
                ) : null}

                <div className="mt-4 flex justify-between text-xs font-semibold uppercase tracking-wide text-muted">
                  <span>Cashback</span>
                  <span>Límite</span>
                </div>
                <div className="mt-1 divide-y divide-divider">
                  {card.cashback.map((c, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 py-2.5 text-[15px]">
                      <span className="text-ink">{c.label}</span>
                      <span className="shrink-0 text-muted">{c.limit}</span>
                    </div>
                  ))}
                </div>

                {card.perks?.length ? (
                  <p className="mt-3 text-sm text-muted">{card.perks.join(", ")}.</p>
                ) : null}

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl bg-page px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                      Ahorro estimado anual
                    </p>
                    <p className="text-lg font-extrabold text-ink">{money(card.estimatedAnnualSavings)}</p>
                  </div>
                  <div className="rounded-2xl bg-page px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">Costo anual</p>
                    <p className="text-lg font-extrabold text-ink">{card.annualCost}</p>
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted">Ingreso mínimo requerido: {card.minIncome}</p>

                <div className="mt-4 flex gap-3">
                  <button className="flex-1 rounded-full bg-brand-orange py-3 text-[15px] font-bold text-white">
                    Ver detalles
                  </button>
                  <button className="flex-1 rounded-full border border-divider py-3 text-[15px] font-bold text-ink">
                    Comparar
                  </button>
                </div>
              </Card>
            ))}

            <Card>
              <h3 className="text-[16px] font-bold text-ink">Otras tarjetas Popular</h3>
              <p className="mt-1 text-sm text-muted">
                No se ajustan tanto a tu consumo actual, pero están disponibles si buscas otro beneficio.
              </p>
              <div className="mt-2 divide-y divide-divider">
                {otherCards.map((card) => (
                  <div key={card.id} className="flex items-center gap-3 py-3">
                    {card.imagePath ? (
                      <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-page">
                        <Image src={card.imagePath} alt={card.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-lg bg-page text-[10px] font-bold text-muted">
                        {card.network}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-[14px] font-bold text-ink">{card.name}</p>
                      <p className="text-xs text-muted">
                        Costo anual {card.annualCost} · Ingreso mínimo {card.minIncome}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold ${
                        card.estimatedAnnualSavings >= 0 ? "text-success" : "text-muted"
                      }`}
                    >
                      {card.estimatedAnnualSavings >= 0
                        ? `${money(card.estimatedAnnualSavings)} / año`
                        : "Sin ahorro extra"}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </>
        ) : null}

        {showActions
          ? ACTIONS.filter((a) => filter === "todas" || a.category === filter).map((action) => (
              <Card key={action.id}>
                <div className="flex gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-page text-ink">
                    {action.direction === "up" ? "↑" : "↓"}
                  </span>
                  <h3 className="text-[16px] font-bold text-ink">{action.title}</h3>
                </div>
                <p className="mt-2 text-sm text-muted">{action.detail}</p>
                <div className="mt-3 flex gap-2">
                  <Pill tone="success">+{action.scoreImpactPts} pts</Pill>
                  <Pill tone="neutral">{action.moneyImpactLabel}</Pill>
                </div>
                <div className="mt-4 flex gap-3">
                  <button className="flex-1 rounded-full bg-brand-orange py-3 text-[15px] font-bold text-white">
                    {action.primaryCta}
                  </button>
                  <button className="flex-1 rounded-full border border-divider py-3 text-[15px] font-bold text-ink">
                    {action.secondaryCta}
                  </button>
                </div>
              </Card>
            ))
          : null}
      </div>
    </div>
  );
}
