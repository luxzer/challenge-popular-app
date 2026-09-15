import { AppHeader } from "@/components/AppHeader";
import { RecommendationsTabs } from "@/components/RecommendationsTabs";
import { ACTIONS, CARDS } from "@/lib/data";

export default function RecomendacionesPage() {
  return (
    <div className="pb-4">
      <AppHeader
        title="Recomendaciones"
        subtitle={`${CARDS.length} tarjetas y ${ACTIONS.length} acciones para ti`}
      />
      <RecommendationsTabs />
    </div>
  );
}
