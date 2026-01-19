import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

import { type AppConfig } from '@/config/configuration';
import { type CrmResponse } from '@/crm-client/crm-client.types';
import { type CrmContact } from '@/modules/contacts/types/contact.types';

@Injectable()
export class CrmClientService {
  protected readonly logger = new Logger(CrmClientService.name);

  constructor(
    protected readonly httpService: HttpService,
    protected readonly configService: ConfigService<AppConfig>
  ) {}

  public async fetchContacts(): Promise<CrmContact[]> {
    const { baseUrl, timeoutMs } = this.configService.getOrThrow('crm');

    try {
      const response = await lastValueFrom(
        this.httpService.get<CrmResponse>(`${baseUrl}/contacts`, {
          timeout: timeoutMs,
        })
      );

      return response.data.data;
    } catch (error) {
      this.logger.error(`Failed to fetch CRM contacts: ${error}`);
      throw error;
    }
  }
}
