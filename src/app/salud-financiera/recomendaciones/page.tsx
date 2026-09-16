import { AppHeader } from "@/components/AppHeader";
import { RecommendationsTabs } from "@/components/RecommendationsTabs";
import { getDemoUser, getSuggestedActions } from "@/lib/db";
import { getRecommendedCards } from "@/lib/recommendations";

export const dynamic = "force-dynamic";

export default async function RecomendacionesPage() {
  const user = await getDemoUser();
  const [{ topCards, otherCards }, actions] = await Promise.all([
    getRecommendedCards(),
    getSuggestedActions(user.id),
  ]);

  return (
    <div className="pb-4">
      <AppHeader
        title="Recomendaciones"
        subtitle={
          actions.length > 0
            ? `${topCards.length} tarjetas y ${actions.length} acciones para ti`
            : `${topCards.length} tarjetas para ti`
        }
      />
      <RecommendationsTabs topCards={topCards} otherCards={otherCards} actions={actions} />
    </div>
  );
}
