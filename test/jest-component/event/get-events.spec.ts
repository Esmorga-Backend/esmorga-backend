import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { EventRepository } from '../../../src/infrastructure/db/repositories';
import { FUTURE_EVENT_MOCK_DB, OLD_EVENT_MOCK_DB } from '../../mocks/db';

const path: string = '/v1/events';

const headers = {
  'Content-Type': 'application/json',
};

describe('Get events - [GET v1/events]', () => {
  let app: INestApplication;
  let eventRepository: EventRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();

    eventRepository = moduleFixture.get<EventRepository>(EventRepository);
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should return a 200 with an upcoming events', async () => {
    jest
      .spyOn(eventRepository, 'find')
      .mockResolvedValue([FUTURE_EVENT_MOCK_DB]);

    const response = await request(app.getHttpServer()).get(path).set(headers);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual({
      totalEvents: 1,
      events: [
        {
          eventId: FUTURE_EVENT_MOCK_DB._id,
          eventName: FUTURE_EVENT_MOCK_DB.eventName,
          eventDate: FUTURE_EVENT_MOCK_DB.eventDate.toISOString(),
          description: FUTURE_EVENT_MOCK_DB.description,
          eventType: FUTURE_EVENT_MOCK_DB.eventType,
          imageUrl: FUTURE_EVENT_MOCK_DB.imageUrl,
          location: FUTURE_EVENT_MOCK_DB.location,
          tags: FUTURE_EVENT_MOCK_DB.tags,
        },
      ],
    });
  });

  it('Should return a 200 with an upcoming events filtered', async () => {
    jest
      .spyOn(eventRepository, 'find')
      .mockResolvedValue([FUTURE_EVENT_MOCK_DB, OLD_EVENT_MOCK_DB]);

    const response = await request(app.getHttpServer()).get(path).set(headers);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual({
      totalEvents: 1,
      events: [
        {
          eventId: FUTURE_EVENT_MOCK_DB._id,
          eventName: FUTURE_EVENT_MOCK_DB.eventName,
          eventDate: FUTURE_EVENT_MOCK_DB.eventDate.toISOString(),
          description: FUTURE_EVENT_MOCK_DB.description,
          eventType: FUTURE_EVENT_MOCK_DB.eventType,
          imageUrl: FUTURE_EVENT_MOCK_DB.imageUrl,
          location: FUTURE_EVENT_MOCK_DB.location,
          tags: FUTURE_EVENT_MOCK_DB.tags,
        },
      ],
    });
  });

  it('Should return a 200 without event list if events are not avaliable', async () => {
    jest.spyOn(eventRepository, 'find').mockResolvedValue([OLD_EVENT_MOCK_DB]);

    const response = await request(app.getHttpServer()).get(path).set(headers);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual({ totalEvents: 0, events: [] });
  });

  it('Should return a 200 without event list if there are no events in the db', async () => {
    jest.spyOn(eventRepository, 'find').mockResolvedValue([]);

    const response = await request(app.getHttpServer()).get(path).set(headers);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual({ totalEvents: 0, events: [] });
  });

  it('Should throw a 500 error if something wrong happended and it is not handled', async () => {
    jest.spyOn(eventRepository, 'find').mockRejectedValue(new Error());

    const response = await request(app.getHttpServer()).get(path).set(headers);

    expect(response.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(response.body).toEqual({
      title: 'internalServerError',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      type: path,
      detail: 'unexpected error',
      errors: ['Internal server error occurred in database operation'],
    });
  });
});
