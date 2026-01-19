import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { CrmClientService } from '@/crm-client/crm-client.service';

@Module({
  imports: [HttpModule],
  providers: [CrmClientService],
  exports: [CrmClientService],
})
export class CrmClientModule {}
