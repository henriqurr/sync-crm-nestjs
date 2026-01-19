import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { CrmClientModule } from '@/crm-client/crm-client.module';
import { ContactsModule } from '@/modules/contacts/contacts.module';
import { ContactsSyncController } from '@/modules/contacts/sync/contacts-sync.controller';
import { ContactsSyncService } from '@/modules/contacts/sync/contacts-sync.service';

@Module({
  imports: [ScheduleModule.forRoot(), CrmClientModule, ContactsModule],
  controllers: [ContactsSyncController],
  providers: [ContactsSyncService],
  exports: [ContactsSyncService],
})
export class ContactsSyncModule {}
