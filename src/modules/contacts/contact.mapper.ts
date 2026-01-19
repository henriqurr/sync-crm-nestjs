import {
  type ContactEntity,
  type CrmContact,
} from '@/modules/contacts/types/contact.types';
import { Utils } from '@/shared/utils';

export const toContactEntity = (contact: CrmContact): ContactEntity => ({
  id: contact.id,
  email: contact.email,
  firstName: contact.firstName,
  lastName: contact.lastName,
  phone: contact.phone,
  company: contact.company,
  jobTitle: contact.jobTitle,
  lifecycleStage: contact.lifecycleStage,
  leadStatus: contact.leadStatus,
  tags: contact.tags,
  ownerId: contact.ownerId,
  source: contact.source,
  address: contact.address,
  marketingOptIn: contact.marketingOptIn,
  gdprConsentAt: Utils.parseDate(contact.gdprConsentAt),
  lastActivityAt: Utils.parseDate(contact.lastActivityAt),
  createdAt: new Date(contact.createdAt),
  updatedAt: new Date(contact.updatedAt),
});
