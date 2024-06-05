import { Test, TestingModule } from '@nestjs/testing';
import { StepDefinitions} from 'jest-cucumber';

import * as request from 'supertest';
import { AppModule } from '../../../../../src/app.module';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { EventRepository } from '../../../../../src/infraestructure/db/repositories';

import { futureEventMockDB, oldEventMockDB } from '../../../../mocks/db';
import { matchers } from 'jest-json-schema';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


const addFormats = require('ajv-formats');
const axios = require('axios');
const SwaggerParser = require('swagger-parser');
const Ajv = require('ajv');

let app : INestApplication;
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
  const rawSchema = response.body
/*const rawSchema = {"openapi":"3.0.0","paths":{"/v1/events":{"get":{"operationId":"EventController_getEvents","summary":"Return a list of avaliable events","parameters":[{"name":"Content-Type","in":"header","description":"application/json","schema":{"type":"string"}}],"responses":{"200":{"description":"List of avaliable events","content":{"application/json":{"schema":{"$ref":"#/components/schemas/EventListDTO"}}}},"500":{"description":"Error not handled","content":{"application/json":{"schema":{"type":"object","properties":{"title":{"type":"string","example":"InternalServerError"},"status":{"type":"number","example":500},"detail":{"type":"string","example":"unexpected error"},"errors":{"type":"array","example":[]},"type":{"type":"string","example":"/v1/events"}}}}}}},"tags":["Event"]}}},"info":{"title":"Esmorga API","description":"Swagger for Esmorga API.","version":"1.0","contact":{}},"tags":[],"servers":[],"components":{"schemas":{"EventDTO":{"type":"object","properties":{"eventId":{"type":"string","example":"6656e23640e1fdb4ceb23cc9"},"eventName":{"type":"string","example":"MobgenFest"},"eventDate":{"format":"date-time","type":"string","example":"2024-03-08T10:05:30.915Z"},"description":{"type":"string","example":"Hello World"},"eventType":{"type":"string","example":"Party"},"imageUrl":{"type":"string","example":"img.url"},"location":{"type":"object","properties":{"lat":{"type":"number","example":43.35525182148881},"long":{"type":"number","example":-8.41937931298951},"name":{"type":"string","example":"A Coruña"}}},"tags":{"example":"[\"Meal\", \"Music\"]","type":"array","items":{"type":"string"}}},"required":["eventId","eventName","eventDate","description","eventType","imageUrl","location","tags"]},"EventListDTO":{"type":"object","properties":{"totalEvents":{"type":"number","example":5},"events":{"type":"array","items":{"$ref":"#/components/schemas/EventDTO"}}},"required":["totalEvents","events"]}}}}
const rawSchema = {"openapi":"3.0.0","paths":{"/v1/events":{"get":{"operationId":"EventController_getEvents","summary":"Return a list of avaliable events","parameters":[{"name":"Content-Type","in":"header","description":"application/json","schema":{"type":"string"}}],
"responses":{"200":{"description":"List of avaliable events","content":{"application/json":{"schema":{"$ref":"#/components/schemas/EventListDTO"}}}},"500":{"description":"Error not handled","content":{"application/json":{"schema":{"type":"object","properties":{"title":{"type":"string","example":"InternalServerError"},
"status":{"type":"number","example":500},"detail":{"type":"string","example":"unexpected error"},"errors":{"type":"array","example":[]},"type":{"type":"string","example":"/v1/events"}}}}}}},"tags":["Event"]}}},"info":{"title":"Esmorga API","description":"Swagger for Esmorga API.","version":"1.0","contact":{}},
"tags":[],"servers":[],"components":{"schemas":{"EventDTO":{"type":"object","properties":{"eventId":{"type":"string","example":"6656e23640e1fdb4ceb23cc9"},"eventName":{"type":"string","example":"MobgenFest"},"eventDate":{"format":"date","type":"string","example":"2024-03-08"},"description":{"type":"string","example":"Hello World"},"eventType":{"type":"string","example":"Party"},"imageUrl":{"type":"string","example":"img.url"},"location":{"type":"object","properties":{"lat":{"type":"number","example":43.35525182148881},"long":{"type":"number","example":-8.41937931298951},"name":{"type":"string","example":"A Coruña"}}},"tags":{"example":"[\"Meal\", \"Music\"]","type":"array","items":{"type":"string"}}},"required":["eventId","eventName","eventDate","description","eventType","imageUrl","location","tags"]},"EventListDTO":{"type":"object","properties":{"totalEvents":{"type":"number","example":5},"events":{"type":"array","items":{"$ref":"#/components/schemas/EventDTO"}}},"required":["totalEvents","events"]}}}}
*/
schema = await SwaggerParser.dereference(rawSchema);
//  schema = 
  
  if (typeof schema !== 'object') {
    console.log('El esquema Swagger no es un objeto válido');
  }
});

afterEach(async () => {
  await app.close();
});



export const getEvents: StepDefinitions = ({ given, and, when, then}) => {
    let response
    let path: string = '';
    const ajv = new Ajv({ strict: false });
    addFormats(ajv)


    given('the GET Events API is available', () => {
      path = '/v1/events';
    });


    and(/^(\d+) Events in DB, (\d+) are in the past$/, (events_on_db,expired_events_on_db) => {
      if (expired_events_on_db == 1 && events_on_db == 2 ){
        jest.spyOn(eventRepository, 'find').mockResolvedValue([futureEventMockDB, oldEventMockDB]);
      }else if (events_on_db == 1){
        jest.spyOn(eventRepository, 'find').mockResolvedValue([futureEventMockDB]);
      }else{
        expect(false).toBe(true)
      }
    });


    when(/^a GET request is made to (\w+) API$/, async (endpoint) => {
      response = await request(app.getHttpServer()).get(path);

    });

    then(/^the response should contain (\d+) upcoming Events$/, ( events_to_check) => {
      expect(response.status).toBe(HttpStatus.OK);
      expect.extend(matchers);
      
      expect(response.body).toMatchObject(
        {"totalEvents": parseInt(events_to_check)}

      )

      if (events_to_check == 1){
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
                tags: futureEventMockDB.tags
              },
            ],
          });
      }else if (events_to_check == 0){
        expect(response.body).toEqual({
          totalEvents: 0,
          events: []
        });
      } else {
        expect(false).toBe(true)
      }        
    });
    
    and('the response should following swagger schema', () => {
      const reference = schema.paths[path].get.responses['200'].content['application/json'].schema
      
      const validate = ajv.compile(reference);
      const valid = validate(response.body);

      if (!valid) {
        console.error(validate.errors);
      }

      expect(valid).toBe(true);


    });

}