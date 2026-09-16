import { getCards } from "./db";
import { getCategoryBreakdown } from "./score";
import { PopularCard } from "./types";

export type MatchedCard = PopularCard & { matchNote: string | null };
type Breakdown = Awaited<ReturnType<typeof getCategoryBreakdown>>;

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
function buildMatchNote(card: PopularCard, breakdown: Breakdown): string | null {
  if (!card.matchCategoryIds?.length) return null;

  const matched = breakdown.filter((b) => card.matchCategoryIds!.includes(b.category.id));
  if (matched.length === 0) return null;

  const totalPct = matched.reduce((sum, b) => sum + b.pct, 0);
  const labels = matched.map((b) => CATEGORY_LABELS[b.category.id] ?? b.category.name.toLowerCase());

  return `Cubre tu ${totalPct}% en ${joinWithY(labels)}`;
}

export async function getRecommendedCards(): Promise<{ topCards: MatchedCard[]; otherCards: PopularCard[] }> {
  const [cards, breakdown] = await Promise.all([getCards(), getCategoryBreakdown()]);

  const topCards = cards
    .filter((c) => c.badge === "top")
    .map((c) => ({ ...c, matchNote: buildMatchNote(c, breakdown) }));
  const otherCards = cards.filter((c) => c.badge === "estandar");

  return { topCards, otherCards };
}
