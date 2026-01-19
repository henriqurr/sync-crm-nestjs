import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '@/app.module';
import { type AppConfig } from '@/config/configuration';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<AppConfig>);
  const port = configService.getOrThrow('port');

  await app.listen(port);
  logger.log(`HTTP server running on port ${port}`);
}

bootstrap().catch((error) => {
  logger.error(error);
});
