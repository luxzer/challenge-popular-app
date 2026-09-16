import { AppHeader } from "@/components/AppHeader";
import { Card, ProgressBar } from "@/components/ui";
import { computeOverallScore, computeScoreFactors, SCORE_MAX_VALUE } from "@/lib/score";

const STATUS_COLOR: Record<string, string> = {
  Excelente: "var(--success)",
  Bueno: "var(--brand-blue)",
  Mejorable: "var(--brand-orange)",
  Bajo: "var(--danger)",
};

const STATUS_TEXT: Record<string, string> = {
  Excelente: "text-success",
  Bueno: "text-brand-blue",
  Mejorable: "text-brand-orange",
  Bajo: "text-danger",
};

export default function ScoreBreakdownPage() {
  const factors = computeScoreFactors();
  const score = computeOverallScore(factors);

  return (
    <div className="pb-8">
      <AppHeader title="Desglose del score" subtitle={`${score} de ${SCORE_MAX_VALUE} · En mejora`} />

      <div className="-mt-4 space-y-4 px-5">
        <Card className="flex items-center gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-brand-blue-light text-xl font-extrabold text-ink">
            {score}
          </div>
          <div>
            <p className="text-[15px] font-bold text-ink">En mejora</p>
            <p className="text-sm text-muted">
              Cinco factores construyen tu score. Toca cualquiera para ver qué lo mueve.
            </p>
          </div>
        </Card>

        <Card className="divide-y divide-divider p-0">
          {factors.map((f, i) => (
            <details key={f.id} open={i === 0} className="group px-5 py-4 open:pb-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                <span className="text-[15px] font-bold text-ink">{f.label}</span>
                <span className="flex items-center gap-2 text-sm">
                  <span className="text-muted">{f.weightPct}%</span>
                  <span className={`font-bold ${STATUS_TEXT[f.status]}`}>{f.status}</span>
                </span>
              </summary>
              <div className="mt-2">
                <ProgressBar pct={f.fillPct} color={STATUS_COLOR[f.status]} />
              </div>
              <p className="mt-3 hidden text-sm text-ink-soft group-open:block">{f.detail}</p>
            </details>
          ))}
        </Card>

        <div className="rounded-3xl bg-[#e3edf5] p-5">
          <h3 className="text-[15px] font-bold text-ink">De dónde salen estos datos</h3>
          <p className="mt-2 text-sm text-ink-soft">
            Todo se calcula con tus transacciones, pagos y balances dentro del banco. No consultamos burós,
            no te pedimos documentos y no tiene costo. El cálculo se actualiza cada vez que abres el módulo.
          </p>
        </div>
      </div>
    </div>
  );
}
