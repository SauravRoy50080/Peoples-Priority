import { usePriorities } from '../hooks/usePriorities';
import PriorityCard from './PriorityCard';

export default function PriorityList({ onSelectCluster }) {
  const { data, isLoading, error } = usePriorities();

  if (isLoading) {
    return (
      <div className="space-y-3 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500 bg-white border rounded-xl mb-6">
        Failed to load priorities. Is the backend running?
      </div>
    );
  }

  const priorities = data?.priorities ?? [];

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Priority Ranking</h2>
        {data?.last_updated && (
          <span className="text-xs text-gray-400">
            Updated {new Date(data.last_updated).toLocaleTimeString()}
          </span>
        )}
      </div>

      {priorities.length === 0 ? (
        <div className="text-center py-10 text-gray-400 bg-white border rounded-xl">
          No priorities yet — submissions will appear here once processed.
        </div>
      ) : (
        priorities.map((p) => (
          <PriorityCard key={p.cluster_id} priority={p} onClick={onSelectCluster} />
        ))
      )}
    </div>
  );
}