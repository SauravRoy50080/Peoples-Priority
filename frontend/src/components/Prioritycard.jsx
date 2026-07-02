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

const scoreTone = (score) => {
  if (score >= 80) return { ring: 'ring-terracotta/30', text: 'text-terracotta', bg: 'bg-terracotta/10' };
  if (score >= 60) return { ring: 'ring-marigold/30', text: 'text-marigold-dark', bg: 'bg-marigold/10' };
  return { ring: 'ring-moss/30', text: 'text-moss', bg: 'bg-moss/10' };
};

export default function PriorityCard({ priority, onClick }) {
  const icon = CATEGORY_ICONS[priority.category] || '📋';
  const score = Number(priority.final_score) || 0;
  const tone = scoreTone(score);

  return (
    <div
      onClick={() => onClick(priority.cluster_id)}
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
      </div>
    </div>
  );
}

function ScoreBar({ label, value }) {
  const v = Number(value) || 0;
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-slate-soft/70 mb-1">{label}</div>
      <div className="h-1 bg-paper-dim rounded-full overflow-hidden">
        <div className="h-full bg-ink rounded-full" style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}