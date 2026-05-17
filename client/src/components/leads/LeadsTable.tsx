import type { Lead } from '@/types/lead';
import { StatusBadge } from './StatusBadge';

interface LeadsTableProps {
  leads: Lead[];
  canDelete: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

export function LeadsTable({ leads, canDelete, onEdit, onDelete }: LeadsTableProps): JSX.Element {
  return (
    <div className="overflow-hidden rounded-lg ring-1 ring-slate-200 dark:ring-slate-800">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
        <thead className="bg-slate-50 dark:bg-slate-900">
          <tr className="text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Source</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-900">
          {leads.map((lead) => (
            <tr key={lead.id} className="text-sm">
              <td className="px-4 py-3 font-medium">{lead.name}</td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{lead.email}</td>
              <td className="px-4 py-3">
                <StatusBadge status={lead.status} />
              </td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{lead.source}</td>
              <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {formatDate(lead.createdAt)}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="inline-flex gap-2">
                  <button type="button" className="btn-secondary" onClick={() => onEdit(lead)}>
                    Edit
                  </button>
                  {canDelete && (
                    <button type="button" className="btn-danger" onClick={() => onDelete(lead)}>
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
