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

<<<<<<< HEAD
const SCORE_COLOR = (score) => {
  if (score >= 80) return 'bg-red-100 text-red-700 border-red-300';
  if (score >= 60) return 'bg-orange-100 text-orange-700 border-orange-300';
  return 'bg-yellow-100 text-yellow-700 border-yellow-300';
=======
const scoreTone = (score) => {
  if (score >= 80) return { ring: 'ring-terracotta/30', text: 'text-terracotta', bg: 'bg-terracotta/10' };
  if (score >= 60) return { ring: 'ring-marigold/30', text: 'text-marigold-dark', bg: 'bg-marigold/10' };
  return { ring: 'ring-moss/30', text: 'text-moss', bg: 'bg-moss/10' };
>>>>>>> Asmita
};

export default function PriorityCard({ priority, onClick }) {
  const icon = CATEGORY_ICONS[priority.category] || '📋';
  const score = Number(priority.final_score) || 0;
<<<<<<< HEAD
=======
  const tone = scoreTone(score);
>>>>>>> Asmita

  return (
    <div
      onClick={() => onClick(priority.cluster_id)}
<<<<<<< HEAD
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
=======
      className="group flex items-start gap-4 p-5 cursor-pointer hover:bg-paper-dim/60 transition-colors"
    >
      <span className="font-mono text-sm text-slate-soft w-6 pt-1 text-right shrink-0">
        {String(priority.rank).padStart(2, '0')}
      </span>

      <span className="text-2xl shrink-0">{icon}</span>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display font-semibold text-ink text-base leading-snug group-hover:text-marigold-dark transition-colors">
            {priority.label}
          </h3>
          <span
            className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-mono font-medium ring-1 ${tone.ring} ${tone.text} ${tone.bg}`}
          >
            {score.toFixed(0)}/100
          </span>
        </div>

        <p className="text-sm text-slate-soft mt-1">
          {priority.count} citizens · {(priority.wards ?? []).join(', ')}
        </p>

        {priority.gemini_reasoning && (
          <p className="text-sm text-slate-soft/90 mt-2 italic border-l-2 border-marigold/40 pl-3">
            {priority.gemini_reasoning}
          </p>
        )}

        <div className="grid grid-cols-4 gap-3 mt-3 max-w-sm">
          <ScoreBar label="Demand" value={priority.demand_score} />
          <ScoreBar label="Need" value={priority.need_score} />
          <ScoreBar label="Urgency" value={priority.urgency_score} />
          <ScoreBar label="Feasible" value={priority.feasibility_score} />
        </div>
>>>>>>> Asmita
      </div>
    </div>
  );
}

function ScoreBar({ label, value }) {
  const v = Number(value) || 0;
  return (
    <div>
<<<<<<< HEAD
      <div className="text-gray-400 mb-1">{label}</div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${v}%` }} />
=======
      <div className="text-[10px] uppercase tracking-wide text-slate-soft/70 mb-1">{label}</div>
      <div className="h-1 bg-paper-dim rounded-full overflow-hidden">
        <div className="h-full bg-ink rounded-full" style={{ width: `${v}%` }} />
>>>>>>> Asmita
      </div>
    </div>
  );
}