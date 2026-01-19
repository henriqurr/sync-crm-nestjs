import { Inject, Injectable, Logger } from '@nestjs/common';
import { type Model } from 'mongoose';

import { CONTACT_MODEL } from '@/modules/contacts/contacts.constants';
import {
  type ContactEntity,
  type ContactsQuery,
} from '@/modules/contacts/types/contact.types';

@Injectable()
export class ContactsRepository {
  protected readonly logger = new Logger(ContactsRepository.name);

  protected readonly DUPLICATE_KEY_ERROR_CODE = 11000;

  constructor(
    @Inject(CONTACT_MODEL)
    protected readonly contactModel: Model<ContactEntity>
  ) {}

  public async findById(id: string): Promise<ContactEntity | null> {
    return this.contactModel.findOne({ id }).lean().exec();
  }

  public async list(query: ContactsQuery): Promise<{
    data: ContactEntity[];
    total: number;
  }> {
    const filter: Record<string, unknown> = {};

    if (query.updatedAfter) {
      filter.updatedAt = { $gt: query.updatedAfter };
    }

    const [data, total] = await Promise.all([
      this.contactModel
        .find(filter)
        .sort({ updatedAt: -1 })
        .skip((query.page - 1) * query.limit)
        .limit(query.limit)
        .lean()
        .exec(),
      this.contactModel.countDocuments(filter).exec(),
    ]);

    return { data, total };
  }

  public async bulkUpsert(
    contacts: ContactEntity[]
  ): Promise<BulkUpsertResult> {
    if (contacts.length === 0) {
      return { matched: 0, modified: 0, upserted: 0, duplicateSkips: 0 };
    }

    const data = this.resolveOperations(contacts);

    try {
      const result = await this.contactModel.bulkWrite(data, {
        ordered: false,
      });

      return {
        matched: result.matchedCount,
        modified: result.modifiedCount,
        upserted: result.upsertedCount,
        duplicateSkips: 0,
      };
    } catch (error) {
      const duplicateSkips = this.getDuplicateKeyCount(error);
      const hasOnlyDuplicates =
        duplicateSkips > 0 && this.isOnlyDuplicateKeyErrors(error);

      if (!hasOnlyDuplicates) {
        throw error;
      }

      const { matched, modified, upserted } = this.getBulkResultCounts(error);

      return {
        matched,
        modified,
        upserted,
        duplicateSkips,
      };
    }
  }

  protected resolveOperations(contacts: ContactEntity[]): BulkWriteOperation[] {
    return contacts.map((contact) => {
      const filter = {
        id: contact.id,
        $or: [
          { updatedAt: { $lt: contact.updatedAt } },
          { updatedAt: { $exists: false } },
        ],
      };

      const { createdAt, ...rest } = contact;

      return {
        updateOne: {
          filter,
          update: {
            $set: rest,
            $setOnInsert: {
              createdAt,
            },
          },
          upsert: true,
        },
      };
    });
  }

  protected isDuplicateKeyError(error: unknown): boolean {
    if (!error || typeof error !== 'object') {
      return false;
    }

    const mongoError = error as { code?: number };
    return mongoError.code === this.DUPLICATE_KEY_ERROR_CODE;
  }

  protected getDuplicateKeyCount(error: unknown): number {
    if (!error || typeof error !== 'object') {
      return 0;
    }

    const bulkError = error as {
      writeErrors?: Array<{ code?: number }>;
    };

    if (!Array.isArray(bulkError.writeErrors)) {
      return 0;
    }

    return bulkError.writeErrors.filter(
      (item) => item.code === this.DUPLICATE_KEY_ERROR_CODE
    ).length;
  }

  protected isOnlyDuplicateKeyErrors(error: unknown) {
    if (!error || typeof error !== 'object') {
      return false;
    }

    const bulkError = error as {
      writeErrors?: Array<{ code?: number }>;
    };

    if (!Array.isArray(bulkError.writeErrors)) {
      return false;
    }

    return bulkError.writeErrors.every(
      (item) => item.code === this.DUPLICATE_KEY_ERROR_CODE
    );
  }

  protected getBulkResultCounts(error: unknown): BulkWriteResult {
    if (!error || typeof error !== 'object') {
      return { matched: 0, modified: 0, upserted: 0 };
    }

    const bulkError = error as {
      result?: {
        matchedCount?: number;
        modifiedCount?: number;
        upsertedCount?: number;
      };
      resultWithCounts?: {
        matchedCount?: number;
        modifiedCount?: number;
        upsertedCount?: number;
      };
    };

    const result = bulkError.result ?? bulkError.resultWithCounts;

    return {
      matched: result?.matchedCount ?? 0,
      modified: result?.modifiedCount ?? 0,
      upserted: result?.upsertedCount ?? 0,
    };
  }
}

type BulkWriteOperation = {
  updateOne: {
    filter: Record<string, unknown>;
    update: Record<string, unknown>;
    upsert: boolean;
  };
};

type BulkWriteResult = {
  matched: number;
  modified: number;
  upserted: number;
};

type BulkUpsertResult = BulkWriteResult & { duplicateSkips: number };
