import { Controller, Post } from '@nestjs/common';

import { ContactsSyncService } from '@/modules/contacts/sync/contacts-sync.service';

@Controller('contacts')
export class ContactsSyncController {
  constructor(protected readonly contactsSyncService: ContactsSyncService) {}

  @Post('sync')
  public async syncContacts() {
    await this.contactsSyncService.syncOnce();
    return { message: 'Sync completed' };
  }
}
