"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLeadHandler = exports.updateLeadHandler = exports.createLeadHandler = exports.getLeadHandler = exports.exportLeadsHandler = exports.listLeadsHandler = void 0;
const json2csv_1 = require("json2csv");
const asyncHandler_1 = require("../../utils/asyncHandler");
const ApiError_1 = require("../../utils/ApiError");
const leadsService = __importStar(require("./leads.service"));
exports.listLeadsHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const query = req.query;
    const { items, meta } = await leadsService.listLeads(query);
    res.json({ success: true, data: items, meta });
});
exports.exportLeadsHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const query = req.query;
    const items = await leadsService.exportLeads(query);
    const fields = ['id', 'name', 'email', 'status', 'source', 'createdAt', 'updatedAt'];
    const parser = new json2csv_1.Parser({ fields });
    const csv = parser.parse(items);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
    res.send(csv);
});
exports.getLeadHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const lead = await leadsService.getLeadById(req.params.id);
    res.json({ success: true, data: lead });
});
exports.createLeadHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user)
        throw ApiError_1.ApiError.unauthorized();
    const lead = await leadsService.createLead(req.body, req.user.id);
    res.status(201).json({ success: true, data: lead });
});
exports.updateLeadHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const lead = await leadsService.updateLead(req.params.id, req.body);
    res.json({ success: true, data: lead });
});
exports.deleteLeadHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await leadsService.deleteLead(req.params.id);
    res.status(204).send();
});
//# sourceMappingURL=leads.controller.js.map