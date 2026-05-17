import type { Request, Response } from 'express';
import { Parser as Json2csvParser } from 'json2csv';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiError } from '../../utils/ApiError';
import * as leadsService from './leads.service';
import type {
  CreateLeadInput,
  ListLeadsQuery,
  UpdateLeadInput,
} from './lead.validators';

export const listLeadsHandler = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as ListLeadsQuery;
  const { items, meta } = await leadsService.listLeads(query);
  res.json({ success: true, data: items, meta });
});

export const exportLeadsHandler = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as ListLeadsQuery;
  const items = await leadsService.exportLeads(query);
  const fields = ['id', 'name', 'email', 'status', 'source', 'createdAt', 'updatedAt'];
  const parser = new Json2csvParser({ fields });
  const csv = parser.parse(items);

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
  res.send(csv);
});

export const getLeadHandler = asyncHandler(async (req: Request, res: Response) => {
  const lead = await leadsService.getLeadById(req.params.id);
  res.json({ success: true, data: lead });
});

export const createLeadHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const lead = await leadsService.createLead(req.body as CreateLeadInput, req.user.id);
  res.status(201).json({ success: true, data: lead });
});

export const updateLeadHandler = asyncHandler(async (req: Request, res: Response) => {
  const lead = await leadsService.updateLead(req.params.id, req.body as UpdateLeadInput);
  res.json({ success: true, data: lead });
});

export const deleteLeadHandler = asyncHandler(async (req: Request, res: Response) => {
  await leadsService.deleteLead(req.params.id);
  res.status(204).send();
});
