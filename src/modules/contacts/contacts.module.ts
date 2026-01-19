import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/database/database.module';
import { contactsProviders } from '@/modules/contacts/contact.providers';
import { ContactsController } from '@/modules/contacts/contacts.controller';
import { ContactsRepository } from '@/modules/contacts/contacts.repository';
import { ContactsService } from '@/modules/contacts/contacts.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ContactsController],
  providers: [...contactsProviders, ContactsRepository, ContactsService],
  exports: [ContactsRepository, ContactsService],
})
export class ContactsModule {}
