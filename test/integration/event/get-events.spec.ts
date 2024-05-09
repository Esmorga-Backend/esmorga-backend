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

  it('Should return a 200 with an event list that have not been celebrated', async () => {
    jest
      .spyOn(eventReposiory, 'find')
      .mockResolvedValue([futureEventDB, oldEventDB]);

    const response = await request(app.getHttpServer()).get(path);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual({
      totalEvents: 1,
      events: [
        {
          eventName: futureEventDB.eventName,
          eventDate: futureEventDB.eventDate.toISOString(),
          description: futureEventDB.description,
          eventType: futureEventDB.eventType,
          imageUrl: futureEventDB.imageUrl,
          location: futureEventDB.location,
          tags: futureEventDB.tags,
          createdAt: futureEventDB.createdAt.toISOString(),
          updatedAt: futureEventDB.updatedAt.toISOString(),
        },
      ],
    });
  });

  it('Should a 200 without event list if there are no events in the db', async () => {
    jest.spyOn(eventReposiory, 'find').mockResolvedValue([]);

    const response = await request(app.getHttpServer()).get(path);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual({ totalEvents: 0, events: [] });
  });

  it('Should return a 500 error if something wrong happended and it is not handled', async () => {
    jest.spyOn(eventReposiory, 'find').mockRejectedValue(new Error());

    const response = await request(app.getHttpServer()).get(path);

    expect(response.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(response.body).toEqual({
      title: 'InternalSerError',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      type: path,
      detail: 'Unexpected error',
      errors: ['Internal server error occurred in database operation'],
    });
  });
});
