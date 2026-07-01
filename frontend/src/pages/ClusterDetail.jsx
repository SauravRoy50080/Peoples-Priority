import { useParams, useNavigate } from 'react-router-dom';
import { useClusterDetail } from '../hooks/usePriorities';

export default function ClusterDetail() {
  const { clusterId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useClusterDetail(clusterId);

  if (isLoading) return <div className="text-center py-10 text-gray-400">Loading...</div>;
  if (error || !data) return <div className="text-center py-10 text-red-500">Cluster not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/')}
        className="text-sm text-gray-500 mb-4 hover:text-gray-800"
      >
        ← Back to dashboard
      </button>

      <div className="bg-white border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">{data.label}</h1>
          <span className="text-lg font-bold text-blue-600">{data.final_score}/100</span>
        </div>

        <p className="text-sm text-gray-700 mb-6">{data.justification}</p>

        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 mb-2">Public data evidence</h2>
          <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
            {data.need_evidence.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 mb-2">Citizen quotes</h2>
          <div className="space-y-2">
            {data.sample_quotes.map((q, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 italic">
                "{q}"
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {data.channels_used.map((c) => (
            <span key={c} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}