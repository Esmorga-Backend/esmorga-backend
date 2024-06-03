import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../../src/app.module';
import { EventRepository } from '../../../../src/infraestructure/db/repositories';
import { futureEventMockDB, oldEventMockDB } from '../../../mocks/db';
import { defineFeature, loadFeature } from 'jest-cucumber';

const feature = loadFeature('test/jest-component/features/MOB_Feature.feature')
const path: string = '/v1/events';

defineFeature(feature, (test) => {
  let app: INestApplication;
  let eventRepository: EventRepository;
  let response

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


  test('TC - Get Events API - With no available events',async ({ given, when, then, and }) => {
    given('the GET Events API is available', () => {
      
    });

    and('0 Events in DB, 0 are in the past', () => {

    });
   

    when('a GET request is made to Events API', async () => {
      response = await request(app.getHttpServer()).get(path);
    });
    then('the response should contain 0 upcoming Events', () => {
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual({
        totalEvents: 0,
        events: [],
    });
    
  });
});
  test('TC - Get Events API - With upcoming events',async ({ given, when, then, and }) => {
    given('the GET Events API is available', () => {
      
    });

    and('1 Events in DB, 0 are in the past', () => {
      jest.spyOn(eventRepository, 'find').mockResolvedValue([futureEventMockDB]);
    });
   

    when('a GET request is made to Events API', async () => {
      response = await request(app.getHttpServer()).get(path);
    });
    then('the response should contain 1 upcoming Events', () => {
      expect(response.status).toBe(HttpStatus.OK);
    });
    and('the response should following swagger schema', () => {
      expect(response.body).toEqual({
        totalEvents: 1,
        events: [
          {
            eventId: futureEventMockDB._id,
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


});
})