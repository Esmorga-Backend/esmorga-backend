import { Test, TestingModule } from '@nestjs/testing';
import { StepDefinitions} from 'jest-cucumber';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EventRepository } from '../../../../src/infrastructure/db/repositories' ;
import { AppModule } from '../../../../src/app.module';
import { getEvents } from  './events/get-events';
import { postEvents } from  './events/post-events';


const axios = require('axios');
const SwaggerParser = require('swagger-parser');

let app : INestApplication;
let eventRepository: EventRepository;
let schema;

const EndPoints: { [key: string]: any } = {};
EndPoints['GETEvents'] = new getEvents();
EndPoints['POSTEvents'] = new postEvents();



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
  schema = await SwaggerParser.dereference(rawSchema);
});

afterEach(async () => {
  await app.close();
});

export const basicSteps: StepDefinitions = ({ given, and, when, then}) => {
    let response
    let path: string = '';
    let EndPointName: string = '';


    given(/^the (\w+) (\w+) API is available$/, (method,endpoint) => {
      EndPointName=method+endpoint
    });

    given(/^the (\w+) (\w+) API is unavailable$/, (method,endpoint) => {
      EndPointName=method+endpoint
      jest.spyOn(eventRepository, 'find').mockRejectedValue(new Error());
    });

    and(/^(\d+) Events in DB, (\d+) are in the past$/, (events_on_db,expired_events_on_db) => {
      EndPoints[EndPointName].mock(eventRepository,events_on_db,expired_events_on_db)
    });

    when(/^a (\w+) request is made to (\w+) API$/, async (method,endpoint) => {
      await EndPoints[EndPointName].makeRequest(app)
    });

    and('response follows swagger schema', () => {
      EndPoints[EndPointName].check_with_swagger(schema)
    });

    then(/^the response should contain (\d+) upcoming Events$/, ( events_to_check) => {
      EndPoints[EndPointName].check_content(events_to_check)
    });

    then(/^error response code (\d+) returned$/, async (error_n) => {
//      EndPoints[EndPointName].check_with_swagger(schema)
      await EndPoints[EndPointName].check_error_response(error_n)
    });


    given('an authenticated user with admin rights is logged in', () => {
//      EndPoints[EndPointName].mock(eventRepository)
      jest.spyOn(eventRepository, 'create').mockResolvedValue();
    });

    and(/^with valid data, use tags: (.*), imageUrl: (.*), location.lat(.*) and location.long:(.*)$/, (arg0, arg1, arg2, arg3) => {
      if (arg0==""){
        EndPoints[EndPointName].setDataToMock('optional')
      }else{
        EndPoints[EndPointName].setDataToMock('valid')
      }
    });

    and('with invalid data', () => {
      
      EndPoints[EndPointName].setDataToMock('invalid')
    });
//    when('a POST request is made to Events API with invalid data', () => {
//    });

    then(/^success response code (\d+) returned$/, (success_n) => {
      EndPoints[EndPointName].check_success_response(success_n)
    });

    and('should not be created', () => {
    });

    and('should be created successfully', () => {
    });
}