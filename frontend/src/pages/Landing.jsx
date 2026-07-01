import { Link } from 'react-router-dom';

const STEPS = [
  { n: '01', title: 'Share your issue', desc: 'Text, voice note, or photo - in any language.' },
  { n: '02', title: 'AI groups it', desc: 'Similar submissions are clustered together automatically.' },
  { n: '03', title: 'MP sees the ranking', desc: 'Issues are ranked by urgency, need, and demand.' },
  { n: '04', title: 'Action is taken', desc: 'Your MP can see what to act on first, backed by data.' },
];

const CATEGORIES = [
  ['Roads & transport', '🛣️'],
  ['Water supply', '💧'],
  ['Schools', '🏫'],
  ['Healthcare', '🏥'],
  ['Electricity', '⚡'],
  ['Agriculture', '🌾'],
  ['Sanitation', '🚮'],
  ['Anything else', '📋'],
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-paper">
      {/* Top nav */}
      <div className="bg-ink text-paper">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-marigold flex items-center justify-center font-display font-semibold text-ink text-sm">
              PP
            </span>
            <span className="font-display font-semibold tracking-wide">
              People's Priority
            </span>
          </div>
          <Link
            to="/login"
            className="bg-paper/10 hover:bg-paper/20 text-paper border border-paper/20 px-4 py-1.5 rounded-full text-sm transition-colors"
          >
            MP Login
          </Link>
        </div>

        {/* Hero */}
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-marigold">
            Constituency development
          </span>
          <h1 className="font-display text-5xl font-semibold mt-3 mb-4 leading-tight">
            Your voice shapes what gets built next.
          </h1>
          <p className="text-paper/60 text-lg max-w-xl mx-auto mb-8">
            Tell your MP what your area needs. Road repairs, water supply,
            schools, health centres. Every submission is counted and ranked.
          </p>
          <Link
            to="/submit"
            className="inline-block bg-marigold hover:bg-marigold-dark text-ink font-semibold px-8 py-3.5 rounded-lg text-base transition-colors"
          >
            Raise an issue
          </Link>
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="font-display text-2xl font-semibold text-ink mb-8 text-center">
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STEPS.map((s) => (
            <div key={s.n} className="bg-white border border-ink/10 rounded-lg p-5 flex gap-4">
              <span className="font-mono text-2xl font-semibold text-marigold/50 shrink-0">
                {s.n}
              </span>
              <div>
                <h3 className="font-display font-semibold text-ink">{s.title}</h3>
                <p className="text-sm text-slate-soft mt-1">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-paper-dim py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-xl font-semibold text-ink mb-6">
            What can you raise?
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {CATEGORIES.map(([label, icon]) => (
              <span
                key={label}
                className="bg-white border border-ink/10 rounded-full px-4 py-2 text-sm text-ink"
              >
                {icon} {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto px-6 py-8 border-t border-ink/10 mt-4 text-center">
        <span className="text-xs text-slate-soft">
          People's Priority - Constituency Development Register
        </span>
      </div>
    </div>
  );
}