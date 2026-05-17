import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export function Navbar(): JSX.Element {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();

  return (
    <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-base font-semibold text-brand-500">
          Smart Leads
        </Link>
        <div className="flex items-center gap-3">
          {user && (
            <span className="hidden text-sm text-slate-600 dark:text-slate-300 sm:inline">
              {user.name} ·{' '}
              <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-xs font-medium uppercase dark:bg-slate-800">
                {user.role}
              </span>
            </span>
          )}
          <button
            type="button"
            onClick={toggle}
            className="btn-secondary"
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          {user && (
            <button type="button" className="btn-secondary" onClick={logout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
