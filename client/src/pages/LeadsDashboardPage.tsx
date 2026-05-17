import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useDebounce } from '@/hooks/useDebounce';
import {
  createLead,
  deleteLead,
  exportLeadsCsv,
  listLeads,
  updateLead,
} from '@/services/leads.service';
import type {
  Lead,
  LeadFilters,
  LeadSource,
  LeadStatus,
  PaginationMeta,
  SortOption,
} from '@/types/lead';
import { LeadsFilters } from '@/components/leads/LeadsFilters';
import { LeadsTable } from '@/components/leads/LeadsTable';
import { Pagination } from '@/components/leads/Pagination';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { LeadFormModal, type LeadFormValues } from '@/components/leads/LeadFormModal';
import { getErrorMessage } from '@/lib/http';

const PAGE_LIMIT = 10;

interface UiState {
  search: string;
  status: LeadStatus | '';
  source: LeadSource | '';
  sort: SortOption;
  page: number;
}

const INITIAL_UI: UiState = {
  search: '',
  status: '',
  source: '',
  sort: 'latest',
  page: 1,
};

function uiToFilters(ui: UiState, search: string): LeadFilters {
  return {
    search: search.trim() || undefined,
    status: ui.status || undefined,
    source: ui.source || undefined,
    sort: ui.sort,
    page: ui.page,
    limit: PAGE_LIMIT,
  };
}

export function LeadsDashboardPage(): JSX.Element {
  const { user } = useAuth();
  const [ui, setUi] = useState<UiState>(INITIAL_UI);
  const debouncedSearch = useDebounce(ui.search, 400);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<Lead | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [exportingCsv, setExportingCsv] = useState<boolean>(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { items, meta: m } = await listLeads(uiToFilters(ui, debouncedSearch));
      setLeads(items);
      setMeta(m);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [ui, debouncedSearch]);

  useEffect(() => {
    void load();
  }, [load]);

  // Reset page when filters change (other than page itself)
  useEffect(() => {
    setUi((prev) => (prev.page === 1 ? prev : { ...prev, page: 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, ui.status, ui.source, ui.sort]);

  function openNew(): void {
    setEditing(null);
    setFormError(null);
    setFormOpen(true);
  }
  function openEdit(lead: Lead): void {
    setEditing(lead);
    setFormError(null);
    setFormOpen(true);
  }

  async function handleSubmit(values: LeadFormValues): Promise<void> {
    setSubmitting(true);
    setFormError(null);
    try {
      if (editing) {
        await updateLead(editing.id, values);
      } else {
        await createLead(values);
      }
      setFormOpen(false);
      await load();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(lead: Lead): Promise<void> {
    if (!window.confirm(`Delete lead "${lead.name}"?`)) return;
    try {
      await deleteLead(lead.id);
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleExport(): Promise<void> {
    setExportingCsv(true);
    try {
      const blob = await exportLeadsCsv(uiToFilters(ui, debouncedSearch));
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setExportingCsv(false);
    }
  }

  const isAdmin = user?.role === 'admin';
  const hasActiveFilters =
    Boolean(ui.search) || Boolean(ui.status) || Boolean(ui.source) || ui.sort !== 'latest';

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-semibold">Leads</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage and track your sales leads.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="btn-secondary"
            onClick={handleExport}
            disabled={exportingCsv || loading}
          >
            {exportingCsv ? 'Exporting…' : 'Export CSV'}
          </button>
          <button type="button" className="btn-primary" onClick={openNew}>
            New lead
          </button>
        </div>
      </div>

      <LeadsFilters
        search={ui.search}
        status={ui.status}
        source={ui.source}
        sort={ui.sort}
        onSearchChange={(v) => setUi((p) => ({ ...p, search: v }))}
        onStatusChange={(v) => setUi((p) => ({ ...p, status: v }))}
        onSourceChange={(v) => setUi((p) => ({ ...p, source: v }))}
        onSortChange={(v) => setUi((p) => ({ ...p, sort: v }))}
        onReset={() => setUi(INITIAL_UI)}
      />

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner label="Loading leads…" />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : leads.length === 0 ? (
        <EmptyState
          title={hasActiveFilters ? 'No leads match your filters' : 'No leads yet'}
          description={
            hasActiveFilters
              ? 'Try adjusting or resetting your filters.'
              : 'Get started by creating your first lead.'
          }
          action={
            hasActiveFilters ? (
              <button type="button" className="btn-secondary" onClick={() => setUi(INITIAL_UI)}>
                Reset filters
              </button>
            ) : (
              <button type="button" className="btn-primary" onClick={openNew}>
                New lead
              </button>
            )
          }
        />
      ) : (
        <>
          <LeadsTable
            leads={leads}
            canDelete={isAdmin}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
          {meta && <Pagination meta={meta} onPageChange={(p) => setUi((s) => ({ ...s, page: p }))} />}
        </>
      )}

      <LeadFormModal
        open={formOpen}
        initial={editing}
        submitting={submitting}
        errorMessage={formError}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
