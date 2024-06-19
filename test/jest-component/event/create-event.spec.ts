import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { EventRepository } from '../../../src/infrastructure/db/repositories';
import {
  CREATE_EVENT_MOCK,
  CREATE_EVENT_WITHOUT_OPTIONAL_FIELDS_MOCK,
} from '../../mocks/dtos';

/**
 * *  Logic realated to authentication will be implemented in phase 2
 * TC-19
 * TC-20
 */

const path: string = '/v1/events';

const headers = {
  'Content-Type': 'application/json',
};

describe('Create a new event - [POST v1/events]', () => {
  let app: INestApplication;
  let eventRepository: EventRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe());

    await app.init();

    eventRepository = moduleFixture.get<EventRepository>(EventRepository);
  });

  afterAll(async () => {
    await app.close();
  });

  it('A POST request to Events API with valid data should return a success response code 201', async () => {
    jest.spyOn(eventRepository, 'save').mockResolvedValue();

    const response = await request(app.getHttpServer())
      .post(path)
      .set(headers)
      .send(CREATE_EVENT_MOCK);

    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.body).toEqual({});
  });

  it('A POST request to Events API with valid data but without optional fields should return a success response code 201', async () => {
    jest.spyOn(eventRepository, 'save').mockResolvedValue();

    const response = await request(app.getHttpServer())
      .post(path)
      .set(headers)
      .send(CREATE_EVENT_WITHOUT_OPTIONAL_FIELDS_MOCK);

    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.body).toEqual({});
  });

  it('A POST request to Events API with invalid data should return an errore response code 400', async () => {
    const wrongEvent = { ...CREATE_EVENT_MOCK };

    delete wrongEvent.eventName;

    const response = await request(app.getHttpServer())
      .post(path)
      .set(headers)
      .send(wrongEvent);

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.errors[0]).toBe('eventName should not be empty');
  });

  it('Should throw a 500 error if something wrong happended and it is not handled', async () => {
    jest.spyOn(eventRepository, 'save').mockRejectedValue(new Error());

    const response = await request(app.getHttpServer())
      .post(path)
      .set(headers)
      .send(CREATE_EVENT_MOCK);

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
