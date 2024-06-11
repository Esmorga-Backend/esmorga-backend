import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { createHash } from 'crypto';
import { AppModule } from '../../../src/app.module';
import {
  AccountRepository,
  TokensRepository,
} from '../../../src/infraestructure/db/repositories';
import { GenerateTokenPair } from '../../../src/domain/services/';

const TTL = parseInt(process.env.ACCESS_TOKEN_TTL);

const PATH: string = '/v1/account/login';

const HEADERS = {
  'Content-Type': 'application/json',
};

const PASSWORD = 'Password3';

const USER = {
  _id: '665f019c17331ebee550b2ff',
  name: 'Scottie Pippen',
  email: 'esmorga.test.03@yopmail.com',
  password: createHash('sha256').update(PASSWORD).digest('hex'),
  role: 'USER',
  createdAt: new Date(),
};

describe('Login - [POST v1/account/login]', () => {
  let app: INestApplication;
  let accountRepository: AccountRepository;
  let tokensRepository: TokensRepository;
  let generateTokenPair: GenerateTokenPair;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe());

    await app.init();

    accountRepository = moduleFixture.get<AccountRepository>(AccountRepository);
    tokensRepository = moduleFixture.get<TokensRepository>(TokensRepository);
    generateTokenPair = moduleFixture.get<GenerateTokenPair>(GenerateTokenPair);
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should return a 200 with a pair of tokens and user profile data', async () => {
    jest.spyOn(accountRepository, 'findOneByEmail').mockResolvedValue(USER);

    jest.spyOn(generateTokenPair, 'generateTokens').mockResolvedValue({
      accessToken: 'ACCESS_TOKEN',
      refreshToken: 'REFRESH_TOKEN',
    });

    jest.spyOn(tokensRepository, 'findByUuid').mockResolvedValue([]);

    jest.spyOn(tokensRepository, 'saveTokens').mockResolvedValue();

    const response = await request(app.getHttpServer())
      .post(PATH)
      .set(HEADERS)
      .send({
        email: USER.email,
        password: PASSWORD,
      });

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toMatchObject({
      accessToken: 'ACCESS_TOKEN',
      refreshToken: 'REFRESH_TOKEN',
      ttl: TTL,
      profile: {
        name: USER.name,
        email: USER.email,
      },
    });
  });
});
