export type CrmContact = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  company: string;
  jobTitle: string;
  lifecycleStage: string;
  leadStatus: string;
  tags: string[];
  ownerId: string;
  source: string;
  address: ContactAddress;
  marketingOptIn: boolean;
  gdprConsentAt?: string;
  lastActivityAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type ContactAddress = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type ContactEntity = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  company: string;
  jobTitle: string;
  lifecycleStage: string;
  leadStatus: string;
  tags: string[];
  ownerId: string;
  source: string;
  address: ContactAddress;
  marketingOptIn: boolean;
  gdprConsentAt?: Date;
  lastActivityAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type ContactsQuery = {
  page: number;
  limit: number;
  updatedAfter?: Date;
};
