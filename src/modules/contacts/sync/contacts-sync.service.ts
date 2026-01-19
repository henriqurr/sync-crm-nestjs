import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';

import { type AppConfig } from '@/config/configuration';
import { CrmClientService } from '@/crm-client/crm-client.service';
import { toContactEntity } from '@/modules/contacts/contact.mapper';
import { ContactsRepository } from '@/modules/contacts/contacts.repository';
import { type ContactEntity } from '@/modules/contacts/types/contact.types';

@Injectable()
export class ContactsSyncService implements OnModuleInit, OnModuleDestroy {
  protected readonly logger = new Logger(ContactsSyncService.name);
  protected intervalRef?: ReturnType<typeof setInterval>;
  protected syncRun = 0;
  protected metrics = {
    runs: 0,
    success: 0,
    failure: 0,
    totalReceived: 0,
    totalProcessed: 0,
    totalDuplicateSkips: 0,
    lastDurationMs: 0,
  };

  constructor(
    protected readonly crmClient: CrmClientService,
    protected readonly contactsRepository: ContactsRepository,
    protected readonly configService: ConfigService<AppConfig>,
    protected readonly schedulerRegistry: SchedulerRegistry
  ) {}

  public onModuleInit() {
    const { pollIntervalMs: intervalMs } = this.configService.getOrThrow('crm');

    this.intervalRef = setInterval(() => {
      this.syncOnce().catch(() => undefined);
    }, intervalMs);

    this.schedulerRegistry.addInterval('contacts-sync', this.intervalRef);

    this.logger.log(`Polling enabled: ${intervalMs}ms`);
  }

  public onModuleDestroy() {
    if (this.intervalRef) {
      clearInterval(this.intervalRef);
      this.schedulerRegistry.deleteInterval('contacts-sync');
    }
  }

  public async syncOnce() {
    const syncId = `${Date.now()}-${++this.syncRun}`;
    const startedAt = Date.now();
    this.metrics.runs++;

    try {
      const contacts = await this.crmClient.fetchContacts();
      const entities = contacts.map(toContactEntity);
      const deduped = this.dedupeById(entities);
      const normalizedEntities = deduped.entities;

      const summary = {
        matched: 0,
        modified: 0,
        upserted: 0,
        duplicateSkips: deduped.duplicateSkips,
      };

      const BATCH_SIZE = 10;

      this.metrics.totalReceived += contacts.length;
      this.metrics.totalProcessed += normalizedEntities.length;

      this.logger.log(
        `Sync started: syncId=${syncId} received=${contacts.length} normalized=${normalizedEntities.length}`
      );

      for (
        let index = 0;
        index < normalizedEntities.length;
        index += BATCH_SIZE
      ) {
        const batch = normalizedEntities.slice(index, index + BATCH_SIZE);
        const result = await this.contactsRepository.bulkUpsert(batch);

        summary.matched += result.matched;
        summary.modified += result.modified;
        summary.upserted += result.upserted;
        summary.duplicateSkips += result.duplicateSkips;
      }

      this.metrics.success++;
      this.metrics.totalDuplicateSkips += summary.duplicateSkips;
      this.metrics.lastDurationMs = Date.now() - startedAt;

      this.logger.log(
        `Sync completed: syncId=${syncId} received=${contacts.length} normalized=${normalizedEntities.length} matched=${summary.matched} modified=${summary.modified} upserted=${summary.upserted} duplicateSkips=${summary.duplicateSkips} durationMs=${this.metrics.lastDurationMs}`
      );
    } catch (error) {
      this.metrics.failure++;
      this.metrics.lastDurationMs = Date.now() - startedAt;
      this.logger.error(`Sync failed: syncId=${syncId} error=${error}`);
      throw error;
    }
  }

  protected dedupeById(entities: ContactEntity[]): {
    entities: ContactEntity[];
    duplicateSkips: number;
  } {
    const byId = new Map<string, ContactEntity>();
    let duplicateSkips = 0;

    for (const entity of entities) {
      const existing = byId.get(entity.id);

      if (existing === undefined) {
        byId.set(entity.id, entity);
        continue;
      }

      if (entity.updatedAt.getTime() > existing.updatedAt.getTime()) {
        byId.set(entity.id, entity);
        duplicateSkips++;
        continue;
      }

      duplicateSkips++;
    }

    return { entities: Array.from(byId.values()), duplicateSkips };
  }
}
