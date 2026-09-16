import { AliadoChat } from "@/components/AliadoChat";
import { getFinancialHealthSummary } from "@/lib/score";

export const dynamic = "force-dynamic";

export default async function AliadoPage() {
  const summary = await getFinancialHealthSummary();

  return (
    <AliadoChat userFirstName={summary.userFirstName} score={summary.score} scoreDeltaMonth={summary.scoreDeltaMonth} />
  );
}
