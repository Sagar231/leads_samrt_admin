"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listLeadsQuerySchema = exports.leadIdSchema = exports.updateLeadSchema = exports.createLeadSchema = void 0;
const zod_1 = require("zod");
const lead_types_1 = require("./lead.types");
exports.createLeadSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2).max(120),
    email: zod_1.z.string().trim().toLowerCase().email(),
    status: zod_1.z.enum(lead_types_1.LEAD_STATUSES).optional(),
    source: zod_1.z.enum(lead_types_1.LEAD_SOURCES),
});
exports.updateLeadSchema = exports.createLeadSchema.partial().refine((data) => Object.keys(data).length > 0, { message: 'At least one field must be provided' });
exports.leadIdSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id'),
});
exports.listLeadsQuerySchema = zod_1.z.object({
    status: zod_1.z.enum(lead_types_1.LEAD_STATUSES).optional(),
    source: zod_1.z.enum(lead_types_1.LEAD_SOURCES).optional(),
    search: zod_1.z.string().trim().min(1).max(120).optional(),
    sort: zod_1.z.enum(lead_types_1.SORT_OPTIONS).default('latest'),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(10),
});
//# sourceMappingURL=lead.validators.js.map