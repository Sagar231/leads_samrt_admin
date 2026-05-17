interface SpinnerProps {
  className?: string;
  label?: string;
}

export function Spinner({ className = 'h-5 w-5', label }: SpinnerProps): JSX.Element {
  return (
    <div className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400">
      <svg
        className={`animate-spin ${className}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
      {label ? <span className="text-sm">{label}</span> : null}
    </div>
  );
}
