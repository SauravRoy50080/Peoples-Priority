import { useStats } from '../hooks/usePriorities';

export default function StatsOverview() {
  const { data, isLoading } = useStats();

<<<<<<< HEAD
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
=======
  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-paper-dim rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  const channels = Object.entries(data.channels_breakdown || {});

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      <StatCard label="Submissions received" value={data.total_submissions} />
      <StatCard label="Issue clusters identified" value={data.total_clusters} />
      <StatCard label="Most reported category" value={data.top_category} accent />
      <div className="bg-ink text-paper rounded-lg p-4">
        <div className="text-[11px] uppercase tracking-wide text-paper/60 mb-2">
          Channels
        </div>
        <div className="space-y-1">
          {channels.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between text-sm">
              <span className="capitalize text-paper/80">{k}</span>
              <span className="font-mono text-marigold">{v}</span>
            </div>
          ))}
        </div>
      </div>
>>>>>>> Asmita
    </div>
  );
}

<<<<<<< HEAD
function StatCard({ label, value, small }) {
  return (
    <div className="bg-white border rounded-xl p-4">
      <div className="text-xs text-gray-400 mb-1">{label}</div>
      <div className={small ? 'text-xs text-gray-700' : 'text-2xl font-bold text-gray-900'}>
=======
function StatCard({ label, value, accent }) {
  return (
    <div className="bg-white border border-ink/10 rounded-lg p-4">
      <div className="text-[11px] uppercase tracking-wide text-slate-soft mb-2">{label}</div>
      <div
        className={`font-display font-semibold ${
          accent ? 'text-2xl text-terracotta' : 'text-3xl text-ink'
        }`}
      >
>>>>>>> Asmita
        {value}
      </div>
    </div>
  );
}