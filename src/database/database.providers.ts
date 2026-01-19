import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mongoose from 'mongoose';

import { type AppConfig } from '@/config/configuration';
import { DATABASE_CONNECTION } from '@/database/database.constants';

const logger = new Logger('Database');

export const databaseProviders = [
  {
    provide: DATABASE_CONNECTION,
    useFactory: (
      configService: ConfigService<AppConfig>
    ): Promise<typeof mongoose> => {
      const { uri: mongoUri } = configService.getOrThrow('database');
      const redactedUri = mongoUri.replace(/\/\/.*@/, '//***:***@');

      return mongoose
        .connect(mongoUri)
        .then((connection) => {
          logger.log(`Connected to MongoDB at ${redactedUri}`);
          return connection;
        })
        .catch((error) => {
          logger.error(`Error connecting to MongoDB: ${error}`);
          throw error;
        });
    },
    inject: [ConfigService],
  },
];
