import { StepDefinitions } from 'jest-cucumber';
import * as argon2 from 'argon2';
import { getUserMockDb } from '../../../../mocks/db';
import { context, moduleFixture } from '../../../steps-config';
import {
  GenerateTokenPair,
  validateLoginCredentials,
} from '../../../../../src/domain/services';
import { ACCOUNT_STATUS } from '../../../../../src/domain/const';
import { ACCOUNT_LOGIN_MOCK } from '../../../../mocks/dtos';

import {
  AccountRepository,
  TokensRepository,
  LoginAttemptsRepository,
} from '../../../../../src/infrastructure/db/repositories';
const TTL = parseInt(process.env.ACCESS_TOKEN_TTL);

export const loginSteps: StepDefinitions = ({ given, and, then }) => {
  given('the POST Login API is available', async () => {
    context.path = '/v1/account/login';

    context.accountRepository =
      moduleFixture.get<AccountRepository>(AccountRepository);

    context.tokensRepository =
      moduleFixture.get<TokensRepository>(TokensRepository);

    // jest.spyOn(argon2, 'verify').mockResolvedValue(true);

    // context.loginAttemptsRepository =
    //   moduleFixture.get<LoginAttemptsRepository>(LoginAttemptsRepository);

    context.generateTokenPair =
      moduleFixture.get<GenerateTokenPair>(GenerateTokenPair);

    const USER_MOCK_DB = await getUserMockDb();

    jest
      .spyOn(context.accountRepository, 'findOneByEmail')
      .mockResolvedValue(USER_MOCK_DB);

    jest.spyOn(context.generateTokenPair, 'generateTokens').mockResolvedValue({
      accessToken: 'ACCESS_TOKEN',
      refreshToken: 'REFRESH_TOKEN',
    });

    jest.spyOn(context.tokensRepository, 'findByUuid').mockResolvedValue([]);

    jest.spyOn(context.tokensRepository, 'save').mockResolvedValue(null);
  });

  and(
    'profile, accessToken and refreshToken are provided with correct schema',
    async () => {
      const USER_MOCK_DB = await getUserMockDb();
      expect(context.response.body).toMatchObject({
        accessToken: 'ACCESS_TOKEN',
        refreshToken: 'REFRESH_TOKEN',
        ttl: TTL,
        profile: {
          name: USER_MOCK_DB.name,
          email: USER_MOCK_DB.email,
        },
      });
    },
  );

  and('user status is UNVERIFIED', async () => {
    const USER_MOCK_DB = await getUserMockDb();

    const USER_MOCK_UNVERIFIED_DB = {
      ...USER_MOCK_DB,
      status: ACCOUNT_STATUS.UNVERIFIED,
    };

    jest
      .spyOn(context.accountRepository, 'findOneByEmail')
      .mockResolvedValue(USER_MOCK_UNVERIFIED_DB);
  });

  and('user status is BLOCKED', async () => {
    const USER_MOCK_DB = await getUserMockDb();

    const USER_MOCK_UNVERIFIED_DB = {
      ...USER_MOCK_DB,
      status: ACCOUNT_STATUS.BLOCKED,
    };

    jest
      .spyOn(context.accountRepository, 'findOneByEmail')
      .mockResolvedValue(USER_MOCK_UNVERIFIED_DB);
  });

  then(/^the result is that (.*)$/, async (result) => {
    //   if (result === 'email error counter +1') {
    //     expect(
    //       context.loginAttemptsRepository.updateLoginAttempts,
    //     ).toHaveBeenCalled();
    //   }
  });
};
