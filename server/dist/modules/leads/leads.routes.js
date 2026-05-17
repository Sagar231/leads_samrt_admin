"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leadsRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const validate_1 = require("../../middleware/validate");
const lead_validators_1 = require("./lead.validators");
const leads_controller_1 = require("./leads.controller");
exports.leadsRouter = (0, express_1.Router)();
// All lead routes require auth
exports.leadsRouter.use(auth_1.requireAuth);
exports.leadsRouter.get('/', (0, validate_1.validate)(lead_validators_1.listLeadsQuerySchema, 'query'), leads_controller_1.listLeadsHandler);
exports.leadsRouter.get('/export', (0, validate_1.validate)(lead_validators_1.listLeadsQuerySchema, 'query'), leads_controller_1.exportLeadsHandler);
exports.leadsRouter.get('/:id', (0, validate_1.validate)(lead_validators_1.leadIdSchema, 'params'), leads_controller_1.getLeadHandler);
exports.leadsRouter.post('/', (0, validate_1.validate)(lead_validators_1.createLeadSchema), leads_controller_1.createLeadHandler);
exports.leadsRouter.patch('/:id', (0, validate_1.validate)(lead_validators_1.leadIdSchema, 'params'), (0, validate_1.validate)(lead_validators_1.updateLeadSchema), leads_controller_1.updateLeadHandler);
exports.leadsRouter.delete('/:id', (0, auth_1.requireRole)('admin'), (0, validate_1.validate)(lead_validators_1.leadIdSchema, 'params'), leads_controller_1.deleteLeadHandler);
//# sourceMappingURL=leads.routes.js.map