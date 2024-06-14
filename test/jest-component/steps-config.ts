import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EventRepository } from '../../src/infrastructure/db/repositories' ;
import { AppModule } from '../../src/app.module';


const SwaggerParser = require('swagger-parser');

let app : INestApplication;
let eventRepository: EventRepository;
let schema:any;
let context:any = {}


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
  jest.spyOn(eventRepository, 'find').mockRejectedValue(new Error());
  const response = await request(app.getHttpServer()).get('/swagger-json');
  const rawSchema = response.body
  schema = await SwaggerParser.dereference(rawSchema);
  context = {};
  context.headers = {
    'Content-Type': 'application/json',
  };
});

afterEach(async () => {
  
  await app.close();
});

export { app, eventRepository, schema, context };