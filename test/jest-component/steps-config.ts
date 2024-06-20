import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AccountRepository, EventRepository, TokensRepository } from '../../src/infrastructure/db/repositories' ;
import { AppModule } from '../../src/app.module';
import { GenerateTokenPair } from '../../src/domain/services';


const SwaggerParser = require('swagger-parser');

let app: INestApplication;
let eventRepository: EventRepository;
let schema:any;
let context:any = {}
let accountRepository: AccountRepository;
let tokensRepository: TokensRepository;
let generateTokenPair: GenerateTokenPair;


beforeEach(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
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
  eventRepository = moduleFixture.get<EventRepository>(EventRepository);
  accountRepository = moduleFixture.get<AccountRepository>(AccountRepository);
  tokensRepository = moduleFixture.get<TokensRepository>(TokensRepository);
  generateTokenPair = moduleFixture.get<GenerateTokenPair>(GenerateTokenPair);
  jest.spyOn(eventRepository, 'find').mockRejectedValue(new Error());
  const response = await request(app.getHttpServer()).get('/swagger-json');
  const rawSchema = response.body
  schema = await SwaggerParser.dereference(rawSchema);
  context = {};
  context.headers = {
    'Content-Type': 'application/json',
  };
  context.mock = {};
});

afterEach(async () => {
  
  await app.close();
});

export { app, eventRepository, schema, context, accountRepository, tokensRepository, generateTokenPair };