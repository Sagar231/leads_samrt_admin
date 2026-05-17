import { Types, type FilterQuery } from 'mongoose';
import { ApiError } from '../../utils/ApiError';
import { Lead, type ILead } from './lead.model';
import type { CreateLeadInput, ListLeadsQuery, UpdateLeadInput } from './lead.validators';
import type { PaginationMeta, PublicLead } from './lead.types';

function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildFilter(query: ListLeadsQuery): FilterQuery<ILead> {
  const filter: FilterQuery<ILead> = {};
  if (query.status) filter.status = query.status;
  if (query.source) filter.source = query.source;
  if (query.search) {
    const safe = escapeRegex(query.search);
    const re = new RegExp(safe, 'i');
    filter.$or = [{ name: re }, { email: re }];
  }
  return filter;
}

export async function listLeads(
  query: ListLeadsQuery,
): Promise<{ items: PublicLead[]; meta: PaginationMeta }> {
  const filter = buildFilter(query);
  const sortOrder = query.sort === 'oldest' ? 1 : -1;
  const skip = (query.page - 1) * query.limit;

  const [docs, total] = await Promise.all([
    Lead.find(filter).sort({ createdAt: sortOrder }).skip(skip).limit(query.limit),
    Lead.countDocuments(filter),
  ]);

  return {
    items: docs.map((d) => d.toPublicJSON()),
    meta: {
      page: query.page,
      limit: query.limit,
      total,
      pages: Math.max(1, Math.ceil(total / query.limit)),
    },
  };
}

export async function exportLeads(query: ListLeadsQuery): Promise<PublicLead[]> {
  const filter = buildFilter(query);
  const sortOrder = query.sort === 'oldest' ? 1 : -1;
  // Export ignores pagination but enforces a hard upper bound for safety.
  const docs = await Lead.find(filter).sort({ createdAt: sortOrder }).limit(10_000);
  return docs.map((d) => d.toPublicJSON());
}

export async function getLeadById(id: string): Promise<PublicLead> {
  const doc = await Lead.findById(id);
  if (!doc) throw ApiError.notFound('Lead not found');
  return doc.toPublicJSON();
}

export async function createLead(input: CreateLeadInput, ownerId: string): Promise<PublicLead> {
  const doc = await Lead.create({
    name: input.name,
    email: input.email,
    status: input.status ?? 'New',
    source: input.source,
    ownerId: new Types.ObjectId(ownerId),
  });
  return doc.toPublicJSON();
}

export async function updateLead(id: string, input: UpdateLeadInput): Promise<PublicLead> {
  const doc = await Lead.findByIdAndUpdate(id, input, {
    new: true,
    runValidators: true,
  });
  if (!doc) throw ApiError.notFound('Lead not found');
  return doc.toPublicJSON();
}

export async function deleteLead(id: string): Promise<void> {
  const res = await Lead.findByIdAndDelete(id);
  if (!res) throw ApiError.notFound('Lead not found');
}
