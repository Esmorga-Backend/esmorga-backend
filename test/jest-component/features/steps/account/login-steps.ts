import { StepDefinitions } from 'jest-cucumber';
import {
  getUserMockDb,
  EMAIL_MOCK_DB,
  PASSWORD_MOCK_DB,
} from '../../../../mocks/db';
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

    context.user = await getUserMockDb();

    context.mock = { email: EMAIL_MOCK_DB, password: PASSWORD_MOCK_DB };

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

    jest
      .spyOn(context.accountRepository, 'findOneByEmail')
      .mockImplementation(async (email) => {
        if (email === context.user.email) {
          return context.user;
        }
        return null;
      });

    jest
      .spyOn(context.accountRepository, 'updateStatusByEmail')
      .mockImplementation(async (email, status) => {
        if (email === context.user.email) {
          context.user = { ...context.user, status };
          return context.user;
        }
        return null;
      });

    jest
      .spyOn(context.accountRepository, 'updateBlockedStatusByUuid')
      .mockResolvedValue(null);

    jest.spyOn(context.generateTokenPair, 'generateTokens').mockResolvedValue({
      accessToken: 'ACCESS_TOKEN',
      refreshToken: 'REFRESH_TOKEN',
    });

    jest.spyOn(context.tokensRepository, 'findByUuid').mockResolvedValue([]);

    jest.spyOn(context.tokensRepository, 'save').mockResolvedValue(null);
  });

  and(/^fail login attempts (\d+)$/, async (result) => {
    jest
      .spyOn(context.loginAttemptsRepository, 'findAndUpdateLoginAttempts')
      .mockResolvedValue({ loginAttempts: Number(result) + 1 });
  });

  and(
    'profile, accessToken and refreshToken are provided with correct schema',
    async () => {
      const USER_MOCK_DB = context.user;

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
    context.user = {
      ...context.user,
      status: ACCOUNT_STATUS.UNVERIFIED,
    };

    jest
      .spyOn(context.accountRepository, 'findOneByEmail')
      .mockImplementation(() => context.user);
  });


  and('user status is BLOCKED', async () => {
    context.user = {
      ...context.user,
      status: ACCOUNT_STATUS.BLOCKED,
    };
    jest
      .spyOn(context.accountRepository, 'findOneByEmail')
      .mockImplementation(() => context.user);
  });

  and('expireBlockedAt is in the past', () => {
    context.user = {
      ...context.user,
      expireBlockedAt: new Date('2024-03-09T10:05:30.915Z'),
    };
    jest
      .spyOn(context.accountRepository, 'findOneByEmail')
      .mockImplementation(() => context.user);
  });

  then(/^the result is that (\d+)$/, async (result) => {
    const execTimes = result !== '0' ? 1 : 0;
    expect(
      context.loginAttemptsRepository.findAndUpdateLoginAttempts,
    ).toHaveBeenCalledTimes(execTimes);
  });

  and(/^actual user status is blocked (\w+)/, (isBlocked) => {
    expect(
      context.accountRepository.updateBlockedStatusByUuid,
    ).toHaveBeenCalledTimes(isBlocked === 'true' ? 1 : 0);
  });
};
