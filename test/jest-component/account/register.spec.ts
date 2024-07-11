import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import {
  AccountRepository,
  TokensRepository,
} from '../../../src/infrastructure/db/repositories';
import { GenerateTokenPair } from '../../../src/domain/services/';
import { ACCOUNT_REGISTER } from '../../mocks/dtos';
import { getUserMockDb } from '../../mocks/db';

const TTL = parseInt(process.env.ACCESS_TOKEN_TTL);

const PATH: string = '/v1/account/register';

const HEADERS = {
  'Content-Type': 'application/json',
};

describe('Register - [POST v1/account/register]', () => {
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

  it('Should return a 201 with a pair of tokens and user profile data', async () => {
    const USER_MOCK_DB = await getUserMockDb();

    jest.spyOn(accountRepository, 'save').mockResolvedValue();

    jest
      .spyOn(accountRepository, 'findOneByEmail')
      .mockResolvedValue(USER_MOCK_DB);

    jest.spyOn(generateTokenPair, 'generateTokens').mockResolvedValue({
      accessToken: 'ACCESS_TOKEN',
      refreshToken: 'REFRESH_TOKEN',
    });

    jest.spyOn(tokensRepository, 'findByUuid').mockResolvedValue([]);

    jest.spyOn(tokensRepository, 'save').mockResolvedValue();

    const response = await request(app.getHttpServer())
      .post(PATH)
      .set(HEADERS)
      .send(ACCOUNT_REGISTER);

    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.body).toMatchObject({
      accessToken: 'ACCESS_TOKEN',
      refreshToken: 'REFRESH_TOKEN',
      ttl: TTL,
      profile: {
        name: USER_MOCK_DB.name,
        email: USER_MOCK_DB.email,
      },
    });
  });

  it('Should throw a 400 if a mandatory field is missed (name/lastName/email/password)', async () => {
    const invalidData = { ...ACCOUNT_REGISTER };

    delete invalidData.email;

    const response = await request(app.getHttpServer())
      .post(PATH)
      .set(HEADERS)
      .send(invalidData);

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.detail).toBe('some inputs are missing');
    expect(response.body.errors).toContain('email should not be empty');
  });

  it('Should throw a 400 if a field type is wrong', async () => {
    const response = await request(app.getHttpServer())
      .post(PATH)
      .set(HEADERS)
      .send({
        name: ACCOUNT_REGISTER.name,
        lastName: ACCOUNT_REGISTER.lastName,
        email: 123,
        password: ACCOUNT_REGISTER.password,
      });

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.detail).toBe('email');
    expect(response.body.errors).toContain('email must be a string');
  });

  it('Should return a 409 if user is already register', async () => {
    jest.spyOn(accountRepository, 'save').mockRejectedValue({ code: 11000 });

    const response = await request(app.getHttpServer())
      .post(PATH)
      .set(HEADERS)
      .send(ACCOUNT_REGISTER);

    expect(response.status).toBe(HttpStatus.CONFLICT);
    expect(response.body).toMatchObject({
      title: 'userAlreadyRegistered',
      status: HttpStatus.CONFLICT,
      type: PATH,
      detail: 'inputs are invalid',
      errors: ['user already registered'],
    });
  });
});
