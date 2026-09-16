import { POPULAR_CARDS, PopularCard } from "./cards-data";
import { getCategoryBreakdown } from "./score";

export type MatchedCard = PopularCard & { matchNote: string | null };

const CATEGORY_LABELS: Record<string, string> = {
  delivery: "delivery y comida rápida",
  supermercado: "supermercado",
  transporte: "combustible",
  servicios: "streaming y suscripciones",
};

function joinWithY(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} y ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;
}

/** Builds a live "Cubre tu X% en..." note from the user's actual spend, for
 * cards whose cashback categories overlap with tracked spend categories. */
function buildMatchNote(card: PopularCard): string | null {
  if (!card.matchCategoryIds?.length) return null;

  const breakdown = getCategoryBreakdown();
  const matched = breakdown.filter((b) => card.matchCategoryIds!.includes(b.category.id));
  if (matched.length === 0) return null;

  const totalPct = matched.reduce((sum, b) => sum + b.pct, 0);
  const labels = matched.map((b) => CATEGORY_LABELS[b.category.id] ?? b.category.name.toLowerCase());

  return `Cubre tu ${totalPct}% en ${joinWithY(labels)}`;
}

export function getRecommendedCards(): { topCards: MatchedCard[]; otherCards: PopularCard[] } {
  const topCards = POPULAR_CARDS.filter((c) => c.badge === "top").map((c) => ({
    ...c,
    matchNote: buildMatchNote(c),
  }));
  const otherCards = POPULAR_CARDS.filter((c) => c.badge === "estandar");

  return { topCards, otherCards };
}
