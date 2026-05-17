export const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Lost'] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_SOURCES = ['Website', 'Instagram', 'Referral'] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export const SORT_OPTIONS = ['latest', 'oldest'] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

export interface Lead {
  id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface LeadListResponse {
  items: Lead[];
  meta: PaginationMeta;
}

export interface LeadFilters {
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort: SortOption;
  page: number;
  limit: number;
}
