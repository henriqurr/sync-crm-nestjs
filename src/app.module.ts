import { Module } from '@nestjs/common';

import { ConfigModule } from '@/config/config.module';
import { ContactsModule } from '@/modules/contacts/contacts.module';
import { ContactsSyncModule } from '@/modules/contacts/sync/contacts-sync.module';

@Module({
  imports: [ConfigModule, ContactsModule, ContactsSyncModule],
})
export class AppModule {}
