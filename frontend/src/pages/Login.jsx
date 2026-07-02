import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const ok = login(username.trim(), password);
    if (ok) {
      navigate('/dashboard', { replace: true });
    } else {
      setError('Incorrect username or password.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="w-14 h-14 rounded-full bg-marigold flex items-center justify-center font-display font-bold text-ink text-xl mx-auto mb-3">
            PP
          </span>
          <h1 className="font-display text-2xl font-semibold text-paper">
            People's Priority
          </h1>
          <p className="text-paper/50 text-sm mt-1">MP Dashboard — restricted access</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-paper border border-ink/20 rounded-lg p-6 space-y-4"
        >
          <div>
            <label className="block text-[11px] uppercase tracking-wide text-slate-soft mb-1.5">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="mp@peoplespriority.in"
              autoComplete="username"
              className="w-full border border-ink/15 rounded-lg px-3 py-2.5 text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-marigold/50"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wide text-slate-soft mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full border border-ink/15 rounded-lg px-3 py-2.5 text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-marigold/50"
            />
          </div>

          {error && <p className="text-sm text-terracotta">{error}</p>}

          <button
            type="submit"
            disabled={loading || !username || !password}
            className="w-full bg-marigold hover:bg-marigold-dark text-ink py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in to dashboard'}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link to="/" className="text-paper/40 text-xs hover:text-paper/70 transition-colors">
            ← Back to citizen portal
          </Link>
        </div>
      </div>
    </div>
  );
}