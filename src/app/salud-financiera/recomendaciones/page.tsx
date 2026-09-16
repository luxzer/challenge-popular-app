import { AppHeader } from "@/components/AppHeader";
import { RecommendationsTabs } from "@/components/RecommendationsTabs";
import { ACTIONS } from "@/lib/data";
import { getRecommendedCards } from "@/lib/recommendations";

export default function RecomendacionesPage() {
  const { topCards } = getRecommendedCards();

  return (
    <div className="pb-4">
      <AppHeader
        title="Recomendaciones"
        subtitle={`${topCards.length} tarjetas y ${ACTIONS.length} acciones para ti`}
      />
      <RecommendationsTabs />
    </div>
  );
}
