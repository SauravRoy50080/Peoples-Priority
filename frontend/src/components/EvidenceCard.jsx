import { useClusterDetail } from '../hooks/usePriorities';

export default function EvidenceCard({ clusterId, onClose }) {
  const { data, isLoading } = useClusterDetail(clusterId);

  if (!clusterId) return null;

  return (
    <div
      className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-paper rounded-lg p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto border border-ink/10"
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading || !data ? (
          <div className="text-center py-14 text-slate-soft">Pulling up the evidence…</div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3 mb-4">
              <h2 className="font-display text-xl font-semibold text-ink">{data.label}</h2>
              <span className="shrink-0 font-mono text-sm font-medium text-terracotta bg-terracotta/10 px-2.5 py-1 rounded-full">
                {data.final_score}/100
              </span>
            </div>

            <p className="text-sm text-slate-soft mb-5">{data.justification}</p>

            <div className="mb-5">
              <h3 className="text-[11px] uppercase tracking-wide text-slate-soft mb-2">
                Public data evidence
              </h3>
              <ul className="text-sm text-ink space-y-1.5">
                {data.need_evidence.map((e, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-marigold-dark">—</span>
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-5">
              <h3 className="text-[11px] uppercase tracking-wide text-slate-soft mb-2">
                Citizen quotes
              </h3>
              <div className="space-y-2">
                {data.sample_quotes.map((q, i) => (
                  <div
                    key={i}
                    className="bg-white border-l-2 border-marigold/50 rounded-r-lg p-3 text-sm text-slate-soft italic"
                  >
                    "{q}"
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              {data.channels_used.map((c) => (
                <span
                  key={c}
                  className="text-xs bg-ink text-paper px-2.5 py-1 rounded-full capitalize"
                >
                  {c}
                </span>
              ))}
            </div>
          </>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full bg-ink hover:bg-ink-light text-paper py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}