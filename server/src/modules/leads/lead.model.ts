import { Schema, model, Types, type HydratedDocument, type Model } from 'mongoose';
import {
  LEAD_SOURCES,
  LEAD_STATUSES,
  type LeadSource,
  type LeadStatus,
  type PublicLead,
} from './lead.types';

export interface ILead {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  ownerId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILeadMethods {
  toPublicJSON(): PublicLead;
}

export type LeadDocument = HydratedDocument<ILead, ILeadMethods>;
export type LeadModel = Model<ILead, Record<string, never>, ILeadMethods>;

const leadSchema = new Schema<ILead, LeadModel, ILeadMethods>(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    status: { type: String, enum: LEAD_STATUSES, default: 'New', required: true, index: true },
    source: { type: String, enum: LEAD_SOURCES, required: true, index: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: true },
);

// Helpful compound indexes for typical queries
leadSchema.index({ status: 1, source: 1, createdAt: -1 });
leadSchema.index({ name: 'text', email: 'text' });

leadSchema.methods.toPublicJSON = function (): PublicLead {
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

export const Lead = model<ILead, LeadModel>('Lead', leadSchema);
