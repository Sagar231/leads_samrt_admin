"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lead = void 0;
const mongoose_1 = require("mongoose");
const lead_types_1 = require("./lead.types");
const leadSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    status: { type: String, enum: lead_types_1.LEAD_STATUSES, default: 'New', required: true, index: true },
    source: { type: String, enum: lead_types_1.LEAD_SOURCES, required: true, index: true },
    ownerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
}, { timestamps: true });
// Helpful compound indexes for typical queries
leadSchema.index({ status: 1, source: 1, createdAt: -1 });
leadSchema.index({ name: 'text', email: 'text' });
leadSchema.methods.toPublicJSON = function () {
    return {
        id: this._id.toString(),
        name: this.name,
        email: this.email,
        status: this.status,
        source: this.source,
        ownerId: this.ownerId.toString(),
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    };
};
exports.Lead = (0, mongoose_1.model)('Lead', leadSchema);
//# sourceMappingURL=lead.model.js.map