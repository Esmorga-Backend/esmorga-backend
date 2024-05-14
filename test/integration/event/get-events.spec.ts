import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { EventReposiory } from '../../../src/infraestructure/db/repositories';
import { futureEventMockDB, oldEventMockDB } from '../../mocks';

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

  it('Should return a 200 with an upcoming events', async () => {
    jest.spyOn(eventReposiory, 'find').mockResolvedValue([futureEventMockDB]);

    const response = await request(app.getHttpServer()).get(path);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual({
      totalEvents: 1,
      events: [
        {
          eventName: futureEventMockDB.eventName,
          eventDate: futureEventMockDB.eventDate.toISOString(),
          description: futureEventMockDB.description,
          eventType: futureEventMockDB.eventType,
          imageUrl: futureEventMockDB.imageUrl,
          location: futureEventMockDB.location,
          tags: futureEventMockDB.tags,
          createdAt: futureEventMockDB.createdAt.toISOString(),
          updatedAt: futureEventMockDB.updatedAt.toISOString(),
        },
      ],
    });
  });

  it('Should return a 200 with an upcoming events filtered', async () => {
    jest
      .spyOn(eventReposiory, 'find')
      .mockResolvedValue([futureEventMockDB, oldEventMockDB]);

    const response = await request(app.getHttpServer()).get(path);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual({
      totalEvents: 1,
      events: [
        {
          eventName: futureEventMockDB.eventName,
          eventDate: futureEventMockDB.eventDate.toISOString(),
          description: futureEventMockDB.description,
          eventType: futureEventMockDB.eventType,
          imageUrl: futureEventMockDB.imageUrl,
          location: futureEventMockDB.location,
          tags: futureEventMockDB.tags,
          createdAt: futureEventMockDB.createdAt.toISOString(),
          updatedAt: futureEventMockDB.updatedAt.toISOString(),
        },
      ],
    });
  });

  it('Should a 200 without event list if events are not avaliable', async () => {
    jest.spyOn(eventReposiory, 'find').mockResolvedValue([oldEventMockDB]);

    const response = await request(app.getHttpServer()).get(path);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual({ totalEvents: 0, events: [] });
  });

  it('Should a 200 without event list if there are no events in the db', async () => {
    jest.spyOn(eventReposiory, 'find').mockResolvedValue([]);

    const response = await request(app.getHttpServer()).get(path);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual({ totalEvents: 0, events: [] });
  });

  it('Should throw a 500 error if something wrong happended and it is not handled', async () => {
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
