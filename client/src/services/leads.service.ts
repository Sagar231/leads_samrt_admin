import { http } from '@/lib/http';
import type { ApiSuccess } from '@/types/api';
import type {
  Lead,
  LeadFilters,
  LeadSource,
  LeadStatus,
  PaginationMeta,
} from '@/types/lead';

export interface CreateLeadPayload {
  name: string;
  email: string;
  status?: LeadStatus;
  source: LeadSource;
}

export type UpdateLeadPayload = Partial<CreateLeadPayload>;

function toParams(filters: LeadFilters): Record<string, string | number> {
  const params: Record<string, string | number> = {
    sort: filters.sort,
    page: filters.page,
    limit: filters.limit,
  };
  if (filters.status) params.status = filters.status;
  if (filters.source) params.source = filters.source;
  if (filters.search && filters.search.trim()) params.search = filters.search.trim();
  return params;
}

export async function listLeads(
  filters: LeadFilters,
): Promise<{ items: Lead[]; meta: PaginationMeta }> {
  const { data } = await http.get<ApiSuccess<Lead[], PaginationMeta>>('/leads', {
    params: toParams(filters),
  });
  return { items: data.data, meta: data.meta as PaginationMeta };
}

export async function getLead(id: string): Promise<Lead> {
  const { data } = await http.get<ApiSuccess<Lead>>(`/leads/${id}`);
  return data.data;
}

export async function createLead(payload: CreateLeadPayload): Promise<Lead> {
  const { data } = await http.post<ApiSuccess<Lead>>('/leads', payload);
  return data.data;
}

export async function updateLead(id: string, payload: UpdateLeadPayload): Promise<Lead> {
  const { data } = await http.patch<ApiSuccess<Lead>>(`/leads/${id}`, payload);
  return data.data;
}

export async function deleteLead(id: string): Promise<void> {
  await http.delete(`/leads/${id}`);
}

export async function exportLeadsCsv(filters: LeadFilters): Promise<Blob> {
  const res = await http.get<Blob>('/leads/export', {
    params: toParams(filters),
    responseType: 'blob',
  });
  return res.data;
}
