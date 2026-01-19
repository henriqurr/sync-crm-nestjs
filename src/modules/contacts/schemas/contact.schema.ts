import * as mongoose from 'mongoose';

import { type ContactEntity } from '@/modules/contacts/types/contact.types';

const AddressSchema = new mongoose.Schema(
  {
    line1: { type: String, required: true },
    line2: { type: String, required: false },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

export const ContactSchema = new mongoose.Schema<ContactEntity>(
  {
    id: { type: String, required: true },
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    company: { type: String, required: true },
    jobTitle: { type: String, required: true },
    lifecycleStage: { type: String, required: true },
    leadStatus: { type: String, required: true },
    tags: { type: [String], required: true },
    ownerId: { type: String, required: true },
    source: { type: String, required: true },
    address: { type: AddressSchema, required: true },
    marketingOptIn: { type: Boolean, required: true },
    gdprConsentAt: { type: Date, required: false },
    lastActivityAt: { type: Date, required: false },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  { timestamps: false, versionKey: false }
);

ContactSchema.index({ id: 1 }, { unique: true });
ContactSchema.index({ updatedAt: -1 });
