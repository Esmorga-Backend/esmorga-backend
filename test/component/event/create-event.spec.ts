import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { EventRepository } from '../../../src/infraestructure/db/repositories';
import {
  createEventMock,
  createEventWithoutOptionalFieldsMock,
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
    jest.spyOn(eventRepository, 'create').mockResolvedValue();

    const response = await request(app.getHttpServer())
      .post(path)
      .set(headers)
      .send(createEventMock);

    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.body).toEqual({});
  });

  it('A POST request to Events API with valid data but without optional fields should return a success response code 201', async () => {
    jest.spyOn(eventRepository, 'create').mockResolvedValue();

    const response = await request(app.getHttpServer())
      .post(path)
      .set(headers)
      .send(createEventWithoutOptionalFieldsMock);

    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.body).toEqual({});
  });

  it('A POST request to Events API with invalid data should return an errore response code 400', async () => {
    const wrongEvent = { ...createEventMock };

    delete wrongEvent.eventName;

    const response = await request(app.getHttpServer())
      .post(path)
      .set(headers)
      .send(wrongEvent);

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.errors).toBe([
      'eventName must be shorter than or equal to 100 characters',
      'eventName must be longer than or equal to 3 characters',
      'eventName must be a string',
      'eventName should not be empty',
    ]);
  });

  it('Should throw a 500 error if something wrong happended and it is not handled', async () => {
    jest.spyOn(eventRepository, 'create').mockRejectedValue(new Error());

    const response = await request(app.getHttpServer()).post(path);

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
