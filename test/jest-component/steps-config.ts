import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as request from 'supertest';

import { AppModule } from '../../src/app.module';

const SwaggerParser = require('swagger-parser');

let app: INestApplication;

let schema: any;
let context: any = {};
let moduleFixture: TestingModule;

beforeEach(async () => {
  moduleFixture = await Test.createTestingModule({
    imports: [AppModule.register({ db: 'none' })],
  }).compile();
  app = moduleFixture.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Esmorga API')
    .setDescription('Swagger for Esmorga API.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);
  await app.init();

  const response = await request(app.getHttpServer()).get('/swagger-json');
  const rawSchema = response.body;
  schema = await SwaggerParser.dereference(rawSchema);
  context = {};
  context.moduleFixture = moduleFixture;
  context.headers = {
    'Content-Type': 'application/json',
  };
  context.mock = {};
});

afterEach(async () => {
  await app.close();
});

export { app, schema, context, moduleFixture };
