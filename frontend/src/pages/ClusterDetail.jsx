import { useParams, useNavigate } from 'react-router-dom';
import { useClusterDetail } from '../hooks/usePriorities';

export default function ClusterDetail() {
  const { clusterId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useClusterDetail(clusterId);

  if (isLoading) {
    return <div className="text-center py-16 text-slate-soft">Loading…</div>;
  }
  if (error || !data) {
    return <div className="text-center py-16 text-terracotta">Cluster not found</div>;
  }

  return (
    <div className="min-h-screen bg-paper p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="text-sm text-slate-soft mb-4 hover:text-ink transition-colors"
        >
          ← Back to register
        </button>

        <div className="bg-white border border-ink/10 rounded-lg p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <h1 className="font-display text-2xl font-semibold text-ink">{data.label}</h1>
            <span className="shrink-0 font-mono text-sm font-medium text-terracotta bg-terracotta/10 px-2.5 py-1 rounded-full">
              {data.final_score}/100
            </span>
          </div>

          <p className="text-sm text-slate-soft mb-6">{data.justification}</p>

          <div className="mb-6">
            <h2 className="text-[11px] uppercase tracking-wide text-slate-soft mb-2">
              Public data evidence
            </h2>
            <ul className="text-sm text-ink space-y-1.5">
              {data.need_evidence.map((e, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-marigold-dark">—</span>
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h2 className="text-[11px] uppercase tracking-wide text-slate-soft mb-2">
              Citizen quotes
            </h2>
            <div className="space-y-2">
              {data.sample_quotes.map((q, i) => (
                <div
                  key={i}
                  className="bg-paper border-l-2 border-marigold/50 rounded-r-lg p-3 text-sm text-slate-soft italic"
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
        </div>
      </div>
    </div>
  );
}