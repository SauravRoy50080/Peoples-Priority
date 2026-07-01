import { useState } from 'react';
import StatsOverview from '../components/StatsOverview';
import HeatmapView from '../components/HeatmapView';
import PriorityList from '../components/PriorityList';
import EvidenceCard from '../components/EvidenceCard';
import ExportButton from '../components/ExportButton';

export default function Dashboard() {
  const [selectedCluster, setSelectedCluster] = useState(null);

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">People's Priority</h1>
          <p className="text-sm text-gray-500">MP Dashboard — Citizen Issue Ranking</p>
        </div>
        <ExportButton />
      </header>

      <StatsOverview />
      <HeatmapView />
      <PriorityList onSelectCluster={setSelectedCluster} />

      {selectedCluster && (
        <EvidenceCard
          clusterId={selectedCluster}
          onClose={() => setSelectedCluster(null)}
        />
      )}
=======
    <div className="min-h-screen bg-paper">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-end justify-between mb-10 border-b border-ink/10 pb-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-marigold-dark">
              Today's register
            </span>
            <h1 className="font-display text-4xl font-semibold text-ink mt-1">
              What your constituency is asking for
            </h1>
            <p className="text-slate-soft mt-2 max-w-xl">
              Citizen submissions, ranked against demand, need, urgency, and feasibility —
              so you can see what to act on first.
            </p>
          </div>
          <ExportButton />
        </div>

        <StatsOverview />
        <HeatmapView />
        <PriorityList onSelectCluster={setSelectedCluster} />

        {selectedCluster && (
          <EvidenceCard
            clusterId={selectedCluster}
            onClose={() => setSelectedCluster(null)}
          />
        )}
      </div>
>>>>>>> Asmita
    </div>
  );
}