import { useStats } from '../hooks/usePriorities';

export default function StatsOverview() {
  const { data, isLoading } = useStats();

  if (isLoading || !data) return null;

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <StatCard label="Total Submissions" value={data.total_submissions} />
      <StatCard label="Issue Clusters" value={data.total_clusters} />
      <StatCard label="Top Category" value={data.top_category} />
      <StatCard
        label="Channels"
        value={Object.entries(data.channels_breakdown || {})
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ')}
        small
      />
    </div>
  );
}

function StatCard({ label, value, small }) {
  return (
    <div className="bg-white border rounded-xl p-4">
      <div className="text-xs text-gray-400 mb-1">{label}</div>
      <div className={small ? 'text-xs text-gray-700' : 'text-2xl font-bold text-gray-900'}>
        {value}
      </div>
    </div>
  );
}