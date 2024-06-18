import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import {
  AccountRepository,
  TokensRepository,
} from '../../../src/infrastructure/db/repositories';
import { USER_DB, PASSWORD } from '../../mocks/db';

const TTL = parseInt(process.env.ACCESS_TOKEN_TTL);

const PATH: string = '/v1/account/login';

const HEADERS = {
  'Content-Type': 'application/json',
};

const VALID_EMAIL = USER_DB.email;

describe('Login - [POST v1/account/login]', () => {
  let app: INestApplication;
  let accountRepository: AccountRepository;
  let tokensRepository: TokensRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe());

    await app.init();

    accountRepository = moduleFixture.get<AccountRepository>(AccountRepository);
    tokensRepository = moduleFixture.get<TokensRepository>(TokensRepository);
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should return a 200 with a pair of tokens and user profile data', async () => {
    jest.spyOn(accountRepository, 'findOneByEmail').mockResolvedValue(USER_DB);

    jest.spyOn(tokensRepository, 'findByUuid').mockResolvedValue([]);

    jest.spyOn(tokensRepository, 'save').mockResolvedValue();

    const response = await request(app.getHttpServer())
      .post(PATH)
      .set(HEADERS)
      .send({
        email: VALID_EMAIL,
        password: PASSWORD,
      });

    const { status, body } = response;

    expect(status).toBe(HttpStatus.OK);
    expect(body).toHaveProperty('accessToken');
    expect(body).toHaveProperty('refreshToken');
    expect(body).toHaveProperty('ttl', TTL);
    expect(body).toHaveProperty('profile');
    expect(body.profile).toMatchObject({
      name: USER_DB.name,
      email: USER_DB.email,
    });
  });

  it('Should throw a 400 if password is missed', async () => {
    const response = await request(app.getHttpServer())
      .post(PATH)
      .set(HEADERS)
      .send({
        email: VALID_EMAIL,
      });

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.detail).toBe('some inputs are missing');
    expect(response.body.errors).toContain('password should not be empty');
  });

  it('Should throw a 400 if email is missed', async () => {
    const response = await request(app.getHttpServer())
      .post(PATH)
      .set(HEADERS)
      .send({
        password: PASSWORD,
      });

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.detail).toBe('some inputs are missing');
    expect(response.body.errors).toContain('email should not be empty');
  });

  it('Should throw a 400 if email type is wrong', async () => {
    const response = await request(app.getHttpServer())
      .post(PATH)
      .set(HEADERS)
      .send({
        email: 123,
        password: PASSWORD,
      });

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.detail).toBe('email');
    expect(response.body.errors).toContain('email must be a string');
  });

  it('Should throw a 400 if email type is wrong', async () => {
    const response = await request(app.getHttpServer())
      .post(PATH)
      .set(HEADERS)
      .send({
        email: VALID_EMAIL,
        password: 123,
      });

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.detail).toBe('password');
    expect(response.body.errors).toContain('password must be a string');
  });

  it('Should throw a 400 if email type is wrong', async () => {
    const response = await request(app.getHttpServer())
      .post(PATH)
      .set(HEADERS)
      .send({
        email: 123,
        password: PASSWORD,
      });

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.detail).toBe('email');
    expect(response.body.errors).toContain('email must be a string');
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
