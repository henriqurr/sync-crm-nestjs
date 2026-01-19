import {
  Controller,
  DefaultValuePipe,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

import { ContactsService } from '@/modules/contacts/contacts.service';
import { type ContactsQuery } from '@/modules/contacts/types/contact.types';

@Controller('contacts')
export class ContactsController {
  constructor(protected readonly contactsService: ContactsService) {}

  @Get()
  public async listContacts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number
  ) {
    const query: ContactsQuery = {
      page: Math.max(page, 1),
      limit: Math.min(Math.max(limit, 1), 100),
    };

    return this.contactsService.list(query);
  }

  @Get(':id')
  public async getContact(@Param('id') id: string) {
    const contact = await this.contactsService.getById(id);

    if (contact === null) {
      throw new NotFoundException('Contact not found');
    }

    return contact;
  }
}
