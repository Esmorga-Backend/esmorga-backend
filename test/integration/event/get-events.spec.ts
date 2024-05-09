import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { EventReposiory } from '../../../src/infraestructure/db/repositories';
import { futureEventDB, oldEventDB } from '../../mocks';

const path: string = '/v1/events';

describe('Get events - [GET v1/events]', () => {
  let app: INestApplication;
  let eventReposiory: EventReposiory;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();

    eventReposiory = moduleFixture.get<EventReposiory>(EventReposiory);
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should a 00 without event list if there are no events in the db', async () => {
    jest.spyOn(eventReposiory, 'find').mockResolvedValue([]);

    const response = await request(app.getHttpServer()).get(path);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toBe({ totalEvents: 0, events: [] });
  });
});
