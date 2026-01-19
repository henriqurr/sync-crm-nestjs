import { type Connection } from 'mongoose';

import { DATABASE_CONNECTION } from '@/database/database.constants';
import { CONTACT_MODEL } from '@/modules/contacts/contacts.constants';
import { ContactSchema } from '@/modules/contacts/schemas/contact.schema';

export const contactsProviders = [
  {
    provide: CONTACT_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Contact', ContactSchema),
    inject: [DATABASE_CONNECTION],
  },
];
