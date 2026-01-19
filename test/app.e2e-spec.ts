import { type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { type App } from 'supertest/types';

import { AppModule } from '@/app.module';

describe('Contacts (E2E)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/contacts (GET)', () => {
    return request(app.getHttpServer())
      .get('/contacts')
      .expect(200)
      .expect((response) => {
        if (!response.body || !Array.isArray(response.body.data)) {
          throw new Error('Response does not include data array');
        }
      });
  });
});
