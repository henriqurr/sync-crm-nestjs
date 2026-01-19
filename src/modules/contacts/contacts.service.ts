import { Injectable } from '@nestjs/common';

import { ContactsRepository } from '@/modules/contacts/contacts.repository';
import {
  type ContactEntity,
  type ContactsQuery,
} from '@/modules/contacts/types/contact.types';

@Injectable()
export class ContactsService {
  constructor(protected readonly contactsRepository: ContactsRepository) {}

  public async getById(id: string): Promise<ContactEntity | null> {
    return this.contactsRepository.findById(id);
  }

  public async list(query: ContactsQuery): Promise<ContactsListResponse> {
    const { data, total } = await this.contactsRepository.list(query);

    return {
      data,
      total,
      page: query.page,
      pages: Math.ceil(total / query.limit),
      limit: query.limit,
      count: data.length,
    };
  }
}

type ContactsListResponse = {
  data: ContactEntity[];
  page: number;
  pages: number;
  limit: number;
  total: number;
  count: number;
};
