import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { EventRepository } from '../../../src/infraestructure/db/repositories';

const path: string = '/v1/events';

describe('Create a new event - [POST v1/events]', () => {
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

  it('Should return a 201 with an empty object', async () => {
    jest.spyOn(eventRepository, 'create').mockResolvedValue();

    const response = await request(app.getHttpServer()).post(path);

    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.body).toEqual({});
  });

  it('Should return a 400 error if wrong ', async () => {});

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
