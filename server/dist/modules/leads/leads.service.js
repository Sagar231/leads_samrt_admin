"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listLeads = listLeads;
exports.exportLeads = exportLeads;
exports.getLeadById = getLeadById;
exports.createLead = createLead;
exports.updateLead = updateLead;
exports.deleteLead = deleteLead;
const mongoose_1 = require("mongoose");
const ApiError_1 = require("../../utils/ApiError");
const lead_model_1 = require("./lead.model");
function escapeRegex(input) {
    return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function buildFilter(query) {
    const filter = {};
    if (query.status)
        filter.status = query.status;
    if (query.source)
        filter.source = query.source;
    if (query.search) {
        const safe = escapeRegex(query.search);
        const re = new RegExp(safe, 'i');
        filter.$or = [{ name: re }, { email: re }];
    }
    return filter;
}
async function listLeads(query) {
    const filter = buildFilter(query);
    const sortOrder = query.sort === 'oldest' ? 1 : -1;
    const skip = (query.page - 1) * query.limit;
    const [docs, total] = await Promise.all([
        lead_model_1.Lead.find(filter).sort({ createdAt: sortOrder }).skip(skip).limit(query.limit),
        lead_model_1.Lead.countDocuments(filter),
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
async function exportLeads(query) {
    const filter = buildFilter(query);
    const sortOrder = query.sort === 'oldest' ? 1 : -1;
    // Export ignores pagination but enforces a hard upper bound for safety.
    const docs = await lead_model_1.Lead.find(filter).sort({ createdAt: sortOrder }).limit(10_000);
    return docs.map((d) => d.toPublicJSON());
}
async function getLeadById(id) {
    const doc = await lead_model_1.Lead.findById(id);
    if (!doc)
        throw ApiError_1.ApiError.notFound('Lead not found');
    return doc.toPublicJSON();
}
async function createLead(input, ownerId) {
    const doc = await lead_model_1.Lead.create({
        name: input.name,
        email: input.email,
        status: input.status ?? 'New',
        source: input.source,
        ownerId: new mongoose_1.Types.ObjectId(ownerId),
    });
    return doc.toPublicJSON();
}
async function updateLead(id, input) {
    const doc = await lead_model_1.Lead.findByIdAndUpdate(id, input, {
        new: true,
        runValidators: true,
    });
    if (!doc)
        throw ApiError_1.ApiError.notFound('Lead not found');
    return doc.toPublicJSON();
}
async function deleteLead(id) {
    const res = await lead_model_1.Lead.findByIdAndDelete(id);
    if (!res)
        throw ApiError_1.ApiError.notFound('Lead not found');
}
//# sourceMappingURL=leads.service.js.map