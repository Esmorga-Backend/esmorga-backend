import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../../src/app.module';
import { EventRepository } from '../../../../src/infraestructure/db/repositories';
import { futureEventMockDB, oldEventMockDB } from '../../../mocks/db';
import { StepDefinitions} from 'jest-cucumber';


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
    const path: string = '/v1/events';
    given('the GET Events API is available', () => {

    });


    and(/^(\d+) Events in DB, (\d+) are in the past$/, (DB_events, arg1) => {
      if (DB_events!=0){
        jest.spyOn(eventRepository, 'find').mockResolvedValue([futureEventMockDB]);
      }
    });


    when('a GET request is made to Events API', async () => {
      response = await request(app.getHttpServer()).get(path);

    });

    then(/^the response should contain (\d+) upcoming Events$/, (DB_events) => {
      expect(response.status).toBe(HttpStatus.OK);
      if (DB_events!=0){
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
//      jest.spyOn(eventRepository, 'find').mockResolvedValue([futureEventMockDB]);
   
}