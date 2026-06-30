import { useClusterDetail } from '../hooks/usePriorities';

export default function EvidenceCard({ clusterId, onClose }) {
  const { data, isLoading } = useClusterDetail(clusterId);

  if (!clusterId) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading || !data ? (
          <div className="text-center py-10 text-gray-400">Loading evidence...</div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">{data.label}</h2>
              <span className="text-lg font-bold text-blue-600">{data.final_score}/100</span>
            </div>

            <p className="text-sm text-gray-700 mb-4">{data.justification}</p>

            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Public Data Evidence</h3>
              <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                {data.need_evidence.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Citizen Quotes</h3>
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
          </>
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
}