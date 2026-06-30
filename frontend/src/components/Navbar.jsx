import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { pathname } = useLocation();
  const isSubmit = pathname.startsWith('/submit');

  return (
    <header className="bg-ink text-paper">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-marigold flex items-center justify-center font-display font-semibold text-ink text-sm">
            PP
          </span>
          <div className="leading-tight">
            <div className="font-display font-semibold tracking-wide">People's Priority</div>
            <div className="text-[11px] text-paper/60 -mt-0.5">Constituency Development Register</div>
          </div>
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-full transition-colors ${
              !isSubmit ? 'bg-paper text-ink font-medium' : 'text-paper/70 hover:text-paper'
            }`}
          >
            MP Dashboard
          </Link>
          <Link
            to="/submit"
            className={`px-3 py-1.5 rounded-full transition-colors ${
              isSubmit ? 'bg-marigold text-ink font-medium' : 'text-paper/70 hover:text-paper'
            }`}
          >
            Raise an issue
          </Link>
        </nav>
      </div>
    </header>
  );
}