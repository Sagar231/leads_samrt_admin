import { Link } from 'react-router-dom';

export function NotFoundPage(): JSX.Element {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
      <p className="text-sm font-medium text-brand-500">404</p>
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        The page you’re looking for doesn’t exist.
      </p>
      <Link to="/" className="btn-primary">
        Back to dashboard
      </Link>
    </div>
  );
}
