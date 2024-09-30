import { StepDefinitions } from 'jest-cucumber';
import { getUserMockDb } from '../../../../mocks/db';
import { context, moduleFixture } from '../../../steps-config';
import {
  GenerateTokenPair,
  ValidateLoginCredentialsService,
} from '../../../../../src/domain/services';
import { ACCOUNT_STATUS } from '../../../../../src/domain/const';
import {
  AccountRepository,
  TokensRepository,
  LoginAttemptsRepository,
} from '../../../../../src/infrastructure/db/repositories';
const TTL = parseInt(process.env.ACCESS_TOKEN_TTL);

export const loginSteps: StepDefinitions = async ({ given, and, then }) => {
  given('the POST Login API is available', async () => {
    context.path = '/v1/account/login';

    context.accountRepository =
      moduleFixture.get<AccountRepository>(AccountRepository);

    context.tokensRepository =
      moduleFixture.get<TokensRepository>(TokensRepository);

    context.loginAttemptsRepository =
      moduleFixture.get<LoginAttemptsRepository>(LoginAttemptsRepository);

    context.generateTokenPair =
      moduleFixture.get<GenerateTokenPair>(GenerateTokenPair);

    context.validateLoginCredentialsService =
      moduleFixture.get<ValidateLoginCredentialsService>(
        ValidateLoginCredentialsService,
      );

    const USER_MOCK_DB = await getUserMockDb();

    jest
      .spyOn(context.accountRepository, 'findOneByEmail')
      .mockImplementation(async (email) => {
        if (email === USER_MOCK_DB.email) {
          return USER_MOCK_DB;
        }
        return null;
      });

    jest
      .spyOn(context.loginAttemptsRepository, 'updateLoginAttempts')
      .mockResolvedValue(0);

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

  then(/^the result is that (\d+)$/, async (result) => {
    expect(
      context.loginAttemptsRepository.updateLoginAttempts,
    ).toHaveBeenCalledTimes(Number(result));
  });
};
