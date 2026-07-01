const CATEGORY_ICONS = {
  Road: '🛣️',
  Water: '💧',
  School: '🏫',
  Health: '🏥',
  Agriculture: '🌾',
  Electricity: '⚡',
  Sanitation: '🚮',
  Other: '📋',
};

const SCORE_COLOR = (score) => {
  if (score >= 80) return 'bg-red-100 text-red-700 border-red-300';
  if (score >= 60) return 'bg-orange-100 text-orange-700 border-orange-300';
  return 'bg-yellow-100 text-yellow-700 border-yellow-300';
};

export default function PriorityCard({ priority, onClick }) {
  const icon = CATEGORY_ICONS[priority.category] || '📋';
  const score = Number(priority.final_score) || 0;

  return (
    <div
      onClick={() => onClick(priority.cluster_id)}
      className="border rounded-xl p-4 mb-3 cursor-pointer hover:shadow-md transition-shadow bg-white"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-400">#{priority.rank}</span>
              <h3 className="font-semibold text-gray-900">{priority.label}</h3>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {priority.count} citizens · {(priority.wards ?? []).join(', ')}
            </p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-bold border ${SCORE_COLOR(score)}`}>
          {score.toFixed(0)}/100
        </div>
      </div>

      {priority.gemini_reasoning && (
        <p className="text-sm text-gray-600 mt-3 italic">"{priority.gemini_reasoning}"</p>
      )}

      <div className="grid grid-cols-4 gap-2 mt-3 text-xs">
        <ScoreBar label="Demand" value={priority.demand_score} />
        <ScoreBar label="Need" value={priority.need_score} />
        <ScoreBar label="Urgency" value={priority.urgency_score} />
        <ScoreBar label="Feasible" value={priority.feasibility_score} />
      </div>
    </div>
  );
}

function ScoreBar({ label, value }) {
  const v = Number(value) || 0;
  return (
    <div>
      <div className="text-gray-400 mb-1">{label}</div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}