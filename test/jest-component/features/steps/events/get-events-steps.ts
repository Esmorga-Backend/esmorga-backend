import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { StepDefinitions } from 'jest-cucumber';
import * as request from 'supertest';
import { matchers } from 'jest-json-schema';
import { AppModule } from '../../../../../src/app.module';
import { EventRepository } from '../../../../../src/infrastructure/db/repositories';
import { FUTURE_EVENT_MOCK_DB, OLD_EVENT_MOCK_DB } from '../../../../mocks/db';

const addFormats = require('ajv-formats');
const axios = require('axios');
const SwaggerParser = require('swagger-parser');
const Ajv = require('ajv');
let app: INestApplication;
let eventRepository: EventRepository;
let schema;

beforeEach(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  app = moduleFixture.createNestApplication();
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Esmorga API')
    .setDescription('Swagger for Esmorga API.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);
  await app.init();
  eventRepository = moduleFixture.get<EventRepository>(EventRepository);
  const response = await request(app.getHttpServer()).get('/swagger-json');
  const rawSchema = response.body;
  schema = await SwaggerParser.dereference(rawSchema);
});

afterEach(async () => {
  await app.close();
});

export const getEvents: StepDefinitions = ({ given, and, when, then }) => {
  let response;
  let path: string = '';
  const ajv = new Ajv({ strict: false });
  addFormats(ajv);

  given('the GET Events API is available', () => {
    path = '/v1/events';
  });

  given('the GET Events API is unavailable', () => {
    path = '/v1/events';
    jest.spyOn(eventRepository, 'find').mockRejectedValue(new Error());
  });

  and(
    /^(\d+) Events in DB, (\d+) are in the past$/,
    (events_on_db, expired_events_on_db) => {
      if (expired_events_on_db == 1 && events_on_db == 2) {
        jest
          .spyOn(eventRepository, 'find')
          .mockResolvedValue([FUTURE_EVENT_MOCK_DB, OLD_EVENT_MOCK_DB]);
      } else if (expired_events_on_db == 1 && events_on_db == 1) {
        jest
          .spyOn(eventRepository, 'find')
          .mockResolvedValue([OLD_EVENT_MOCK_DB]);
      } else if (events_on_db == 1) {
        jest
          .spyOn(eventRepository, 'find')
          .mockResolvedValue([FUTURE_EVENT_MOCK_DB]);
      } else if (expired_events_on_db != 0 && events_on_db != 0) {
        expect(false).toBe(true);
      }
    },
  );

  when(/^a GET request is made to (\w+) API$/, async (endpoint) => {
    response = await request(app.getHttpServer()).get(path);
  });

  then(
    /^the response should contain (\d+) upcoming Events$/,
    (events_to_check) => {
      expect(response.status).toBe(HttpStatus.OK);
      expect.extend(matchers);
      expect(response.body).toMatchObject({
        totalEvents: parseInt(events_to_check),
      });
      if (events_to_check == 1) {
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
      } else if (events_to_check == 0) {
        expect(response.body).toEqual({
          totalEvents: 0,
          events: [],
        });
      } else {
        expect(false).toBe(true);
      }
    },
  );

  and('the response should following swagger schema', () => {
    const reference =
      schema.paths[path].get.responses[response.status].content[
        'application/json'
      ].schema;
    const validate = ajv.compile(reference);
    const valid = validate(response.body);
    if (!valid) {
      console.error(validate.errors);
    }
    expect(valid).toBe(true);
  });

  then(/^an error (\d+) in response should be returned$/, (error) => {
    if (error == 500) {
      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(response.body).toEqual({
        title: 'internalServerError',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        type: path,
        detail: 'unexpected error',
        errors: ['Internal server error occurred in database operation'],
      });
    } else {
      expect(true).toBe(false);
    }
  });
};
