import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import {
  EventRepository,
  TokensRepository,
  EventParticipantsRepository,
} from '../../../src/infrastructure/db/repositories';
import { FUTURE_EVENT_MOCK_DB, PAIR_OF_TOKENS_MOCK_DB } from '../../mocks/db';

const PATH: string = '/v1/account/events';

const HEADERS = {
  'Content-Type': 'application/json',
  Authorization: 'Bearer accessToken',
};

describe('Join event - [POST v1/account/events]', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let eventRepository: EventRepository;
  let tokensRepository: TokensRepository;
  let eventParticipantsRepository: EventParticipantsRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe());

    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);
    eventRepository = moduleFixture.get<EventRepository>(EventRepository);
    tokensRepository = moduleFixture.get<TokensRepository>(TokensRepository);
    eventParticipantsRepository =
      moduleFixture.get<EventParticipantsRepository>(
        EventParticipantsRepository,
      );
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should return a 204 as sucessfully response', async () => {
    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({});

    jest
      .spyOn(tokensRepository, 'findOneByAccessToken')
      .mockResolvedValue(PAIR_OF_TOKENS_MOCK_DB);

    jest
      .spyOn(eventRepository, 'findByIdentifier')
      .mockResolvedValue(FUTURE_EVENT_MOCK_DB);

    jest
      .spyOn(eventParticipantsRepository, 'findAndUpdateParticipantsList')
      .mockResolvedValue();

    const response = await request(app.getHttpServer())
      .post(PATH)
      .set(HEADERS)
      .send({
        eventId: 'eventId',
      });

    expect(response.status).toBe(HttpStatus.NO_CONTENT);
  });
});
