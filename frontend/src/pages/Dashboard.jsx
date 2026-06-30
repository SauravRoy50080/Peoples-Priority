import { useState } from 'react';
import StatsOverview from '../components/StatsOverview';
import HeatmapView from '../components/HeatmapView';
import PriorityList from '../components/PriorityList';
import EvidenceCard from '../components/EvidenceCard';
import ExportButton from '../components/ExportButton';

export default function Dashboard() {
  const [selectedCluster, setSelectedCluster] = useState(null);

  return (
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
    </div>
  );
}