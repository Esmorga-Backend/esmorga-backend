import { Test, TestingModule } from '@nestjs/testing';
import { StepDefinitions} from 'jest-cucumber';

import * as request from 'supertest';
import { AppModule } from '../../../../../src/app.module';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { EventRepository } from '../../../../../src/infraestructure/db/repositories';

import { futureEventMockDB, oldEventMockDB } from '../../../../mocks/db';


let app : INestApplication;
let eventRepository: EventRepository;

beforeEach(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  app = moduleFixture.createNestApplication();
  await app.init();
  eventRepository = moduleFixture.get<EventRepository>(EventRepository);
});

afterEach(async () => {
  await app.close();
});



export const getEvents: StepDefinitions = ({ given, and, when, then}) => {
    let response
    let path: string = '';
    

    given('the GET Events API is available', () => {
      path = '/v1/events';
    });


    and(/^(\d+) Events in DB, (\d+) are in the past$/, (events_on_db,expired_events_on_db) => {
      if (expired_events_on_db!=0){
        jest.spyOn(eventRepository, 'find').mockResolvedValue([futureEventMockDB, oldEventMockDB]);
      }else if (events_on_db!=0){
        jest.spyOn(eventRepository, 'find').mockResolvedValue([futureEventMockDB]);
      }
    });


    when(/^a GET request is made to (\w+) API$/, async (endpoint) => {
      response = await request(app.getHttpServer()).get(path);

    });

    then(/^the response should contain (\d+) upcoming Events$/, (events_to_check) => {
      expect(response.status).toBe(HttpStatus.OK);
      console.log(response.body)

      if (events_to_check!=0){
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
        })
      }else{
          expect(response.body).toEqual({
            totalEvents: 0 ,
            events: []
          })
      }   
    });
    and('the response should following swagger schema', () => {

    });

}