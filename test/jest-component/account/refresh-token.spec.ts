import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { GenerateTokenPair } from '../../../src/domain/services/';
import { TokensRepository } from '../../../src/infrastructure/db/repositories';
import { PAIR_OF_TOKENS_MOCK_DB, TTL_MOCK_DB } from '../../mocks/db';

const PATH = '/v1/account/refresh';

const HEADERS = {
  'Content-Type': 'application/json',
};

describe('Refresh Token - [POST v1/account/refresh]', () => {
  let app: INestApplication;
  let tokensRepository: TokensRepository;
  let generateTokenPair: GenerateTokenPair;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe());

    await app.init();

    tokensRepository = moduleFixture.get<TokensRepository>(TokensRepository);
    generateTokenPair = moduleFixture.get<GenerateTokenPair>(GenerateTokenPair);
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should return a 200 with a new pair of tokens', async () => {
    jest
      .spyOn(tokensRepository, 'getPairOfTokensByRefreshToken')
      .mockResolvedValue(PAIR_OF_TOKENS);

    jest.spyOn(generateTokenPair, 'generateTokens').mockResolvedValue({
      accessToken: 'ACCESS_TOKEN',
      refreshToken: 'REFRESH_TOKEN',
    });

    jest.spyOn(tokensRepository, 'save').mockResolvedValue();

    jest.spyOn(tokensRepository, 'removeById').mockResolvedValue();

    const response = await request(app.getHttpServer())
      .post(PATH)
      .set(HEADERS)
      .send({
        refreshToken: 'refreshToken',
      });

    expect(response.status).toBe(HttpStatus.OK);

    expect(response.body).toMatchObject({
      accessToken: 'ACCESS_TOKEN',
      refreshToken: 'REFRESH_TOKEN',
      ttl: TTL,
    });
  });

  it('Should throw a 400 if refreshToken is missed', async () => {
    const response = await request(app.getHttpServer())
      .post(PATH)
      .set(HEADERS)
      .send({
        refreshToken: '',
      });

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.detail).toBe('some inputs are missing');
  });

  it('Should throw a 401 if refreshToken is not found in the db or if the field type is incorrect.', async () => {
    jest
      .spyOn(tokensRepository, 'getPairOfTokensByRefreshToken')
      .mockResolvedValue(null);

    const response = await request(app.getHttpServer())
      .post(PATH)
      .set(HEADERS)
      .send({
        refreshToken: 'refreshToken',
      });

    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    expect(response.body).toMatchObject({
      title: 'unauthorizedRequestError',
      status: HttpStatus.UNAUTHORIZED,
      type: PATH,
      detail: 'unauthorized',
      errors: ['unauthorized'],
    });
  });
});
