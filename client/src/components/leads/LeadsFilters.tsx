import { LEAD_SOURCES, LEAD_STATUSES, type LeadSource, type LeadStatus, type SortOption } from '@/types/lead';

interface LeadsFiltersProps {
  search: string;
  status: LeadStatus | '';
  source: LeadSource | '';
  sort: SortOption;
  onSearchChange: (v: string) => void;
  onStatusChange: (v: LeadStatus | '') => void;
  onSourceChange: (v: LeadSource | '') => void;
  onSortChange: (v: SortOption) => void;
  onReset: () => void;
}

export function LeadsFilters(props: LeadsFiltersProps): JSX.Element {
  const {
    search,
    status,
    source,
    sort,
    onSearchChange,
    onStatusChange,
    onSourceChange,
    onSortChange,
    onReset,
  } = props;

  return (
    <div className="card flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="flex-1 min-w-[200px]">
        <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
          Search (name or email)
        </label>
        <input
          type="search"
          placeholder="e.g. Rahul or rahul@…"
          className="input"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
          Status
        </label>
        <select
          className="input"
          value={status}
          onChange={(e) => onStatusChange(e.target.value as LeadStatus | '')}
        >
          <option value="">All</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
          Source
        </label>
        <select
          className="input"
          value={source}
          onChange={(e) => onSourceChange(e.target.value as LeadSource | '')}
        >
          <option value="">All</option>
          {LEAD_SOURCES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
          Sort
        </label>
        <select
          className="input"
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      <button type="button" className="btn-secondary" onClick={onReset}>
        Reset
      </button>
    </div>
  );
}
