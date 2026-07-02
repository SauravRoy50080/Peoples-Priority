import { usePriorities } from '../hooks/usePriorities';
import PriorityCard from './PriorityCard';

export default function PriorityList({ onSelectCluster }) {
  const { data, isLoading, error } = usePriorities();

  if (isLoading) {
    return (
      <div className="space-y-2 mb-10">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 bg-paper-dim rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-terracotta bg-white border border-terracotta/30 rounded-lg mb-10">
        Couldn't load the register. Is the backend running?
      </div>
    );
  }

  const priorities = data?.priorities ?? [];

  return (
    <div className="mb-10">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="font-display text-xl font-semibold text-ink">Priority register</h2>
        {data?.last_updated && (
          <span className="font-mono text-xs text-slate-soft">
            Updated {new Date(data.last_updated).toLocaleTimeString()}
          </span>
        )}
      </div>

      {priorities.length === 0 ? (
        <div className="text-center py-14 text-slate-soft bg-white border border-dashed border-ink/15 rounded-lg">
          Nothing logged yet. Submissions will appear here once processed.
        </div>
      ) : (
        <div className="divide-y divide-ink/10 border border-ink/10 rounded-lg overflow-hidden bg-white">
          {priorities.map((p) => (
            <PriorityCard key={p.cluster_id} priority={p} onClick={onSelectCluster} />
          ))}
        </div>
      )}
    </div>
  );
}