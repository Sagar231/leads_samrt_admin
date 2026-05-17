import type { LeadStatus } from '@/types/lead';

const STYLES: Record<LeadStatus, string> = {
  New: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200',
  Contacted: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200',
  Qualified: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200',
  Lost: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200',
};

export function StatusBadge({ status }: { status: LeadStatus }): JSX.Element {
  return <span className={`badge ${STYLES[status]}`}>{status}</span>;
}
