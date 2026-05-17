import { Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import {
  createLeadSchema,
  leadIdSchema,
  listLeadsQuerySchema,
  updateLeadSchema,
} from './lead.validators';
import {
  createLeadHandler,
  deleteLeadHandler,
  exportLeadsHandler,
  getLeadHandler,
  listLeadsHandler,
  updateLeadHandler,
} from './leads.controller';

export const leadsRouter = Router();

// All lead routes require auth
leadsRouter.use(requireAuth);

leadsRouter.get('/', validate(listLeadsQuerySchema, 'query'), listLeadsHandler);
leadsRouter.get('/export', validate(listLeadsQuerySchema, 'query'), exportLeadsHandler);
leadsRouter.get('/:id', validate(leadIdSchema, 'params'), getLeadHandler);
leadsRouter.post('/', validate(createLeadSchema), createLeadHandler);
leadsRouter.patch(
  '/:id',
  validate(leadIdSchema, 'params'),
  validate(updateLeadSchema),
  updateLeadHandler,
);
leadsRouter.delete(
  '/:id',
  requireRole('admin'),
  validate(leadIdSchema, 'params'),
  deleteLeadHandler,
);
