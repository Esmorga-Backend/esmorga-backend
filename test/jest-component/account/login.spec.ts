import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import {
  AccountRepository,
  TokensRepository,
} from '../../../src/infrastructure/db/repositories';
import { GenerateTokenPair } from '../../../src/domain/services/';
import { USER_DB, PASSWORD } from '../../mocks/db';

const TTL = parseInt(process.env.ACCESS_TOKEN_TTL);

const PATH: string = '/v1/account/login';

const HEADERS = {
  'Content-Type': 'application/json',
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
    jest.spyOn(accountRepository, 'findOneByEmail').mockResolvedValue(USER_DB);

    jest.spyOn(generateTokenPair, 'generateTokens').mockResolvedValue({
      accessToken: 'ACCESS_TOKEN',
      refreshToken: 'REFRESH_TOKEN',
    });

    jest.spyOn(tokensRepository, 'findByUuid').mockResolvedValue([]);

    jest.spyOn(tokensRepository, 'saveTokens').mockResolvedValue();

    const validEmail = USER_DB.email;

    const response = await request(app.getHttpServer())
      .post(PATH)
      .set(HEADERS)
      .send({
        email: validEmail,
        password: PASSWORD,
      });

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toMatchObject({
      accessToken: 'ACCESS_TOKEN',
      refreshToken: 'REFRESH_TOKEN',
      ttl: TTL,
      profile: {
        name: USER_DB.name,
        email: USER_DB.email,
      },
    });
  });

  it('Should throw a 400 if email or password are missed', async () => {
    const response = await request(app.getHttpServer())
      .post(PATH)
      .set(HEADERS)
      .send({
        password: PASSWORD,
      });

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('Should throw a 401 if email does not match with an user in the db', async () => {
    jest.spyOn(accountRepository, 'findOneByEmail').mockResolvedValue(null);

    const response = await request(app.getHttpServer())
      .post(PATH)
      .set(HEADERS)
      .send({
        email: 'fakeEmail@gmail.com',
        password: PASSWORD,
      });

    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    expect(response.body).toMatchObject({
      title: 'unauthorizedRequestError',
      status: HttpStatus.UNAUTHORIZED,
      type: PATH,
      detail: 'inputs are invalid',
      errors: ['email password combination is not correct'],
    });
  });

  it('Should throw a 401 if password is not correct', async () => {
    jest.spyOn(accountRepository, 'findOneByEmail').mockResolvedValue(USER_DB);

    const validEmail = USER_DB.email;

    const response = await request(app.getHttpServer())
      .post(PATH)
      .set(HEADERS)
      .send({
        email: validEmail,
        password: 'fakePassword123',
      });

    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    expect(response.body).toMatchObject({
      title: 'unauthorizedRequestError',
      status: HttpStatus.UNAUTHORIZED,
      type: PATH,
      detail: 'inputs are invalid',
      errors: ['email password combination is not correct'],
    });
  });
});
