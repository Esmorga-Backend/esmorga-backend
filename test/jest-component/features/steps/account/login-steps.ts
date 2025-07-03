import { ConfigService } from '@nestjs/config';
import { StepDefinitions } from 'jest-cucumber';
import * as argon2 from 'argon2';
import {
  EMAIL_MOCK_DB,
  PASSWORD_MOCK_DB,
  getUserProfile,
} from '../../../../mocks/db';
import { context, moduleFixture } from '../../../steps-config';
import {
  SessionGenerator,
  ValidateLoginCredentialsService,
} from '../../../../../src/domain/services';
import { ACCOUNT_STATUS } from '../../../../../src/domain/const';
import {
  PasswordSymbol,
  UserDA,
} from '../../../../../src/infrastructure/db/modules/none/user-da';
import { SessionDA } from '../../../../../src/infrastructure/db/modules/none/session-da';
import { LoginAttemptsDA } from '../../../../../src/infrastructure/db/modules/none/login-attempts-da';

export const loginSteps: StepDefinitions = async ({ given, and, then }) => {
  let TTL = 0;
  given('the POST Login API is available', async () => {
    context.path = '/v1/account/login';

    context.user = {
      ...(await getUserProfile()),
      [PasswordSymbol]: PASSWORD_MOCK_DB,
    };

    const configService = moduleFixture.get<ConfigService>(ConfigService);
    TTL = configService.get('ACCESS_TOKEN_TTL');

    context.mock = { email: EMAIL_MOCK_DB, password: PASSWORD_MOCK_DB };

    context.userDA = moduleFixture.get<UserDA>(UserDA);

    context.sessionDA = moduleFixture.get<SessionDA>(SessionDA);
    argon2.verify;
    context.loginAttemptsDA =
      moduleFixture.get<LoginAttemptsDA>(LoginAttemptsDA);

    context.sessionGenerator =
      moduleFixture.get<SessionGenerator>(SessionGenerator);

    context.validateLoginCredentialsService =
      moduleFixture.get<ValidateLoginCredentialsService>(
        ValidateLoginCredentialsService,
      );
    jest
      .spyOn(argon2, 'verify')
      .mockImplementation(
        async (password, password2) => password === password2,
      );

    jest
      .spyOn(context.userDA, 'findOneByEmail')
      .mockImplementation(async (email) => {
        if (email === context.user.email) {
          return context.user;
        }
        return null;
      });

    jest
      .spyOn(context.userDA, 'updateStatusByEmail')
      .mockImplementation(async (email, status) => {
        if (email === context.user.email) {
          context.user.status = status;
          return context.user;
        }
        return null;
      });

    jest
      .spyOn(context.userDA, 'updateBlockedStatusByUuid')
      .mockResolvedValue(null);

    jest.spyOn(context.sessionGenerator, 'generateSession').mockResolvedValue({
      accessToken: 'ACCESS_TOKEN',
      refreshToken: 'REFRESH_TOKEN',
      sessionId: 'SESSION_ID',
    });

    jest.spyOn(context.sessionDA, 'findByUuid').mockResolvedValue([]);
    jest.spyOn(context.sessionDA, 'create').mockResolvedValue(null);

    jest.spyOn(context.loginAttemptsDA, 'removeByUuid').mockResolvedValue(null);
  });

  and(/^fail login attempts (\d+)$/, async (result) => {
    jest
      .spyOn(context.loginAttemptsDA, 'findAndUpdateLoginAttempts')
      .mockResolvedValue(Number(result) + 1);
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
          lastName: USER_MOCK_DB.lastName,
          email: USER_MOCK_DB.email,
          role: USER_MOCK_DB.role,
        },
      });
    },
  );

  and('user status is UNVERIFIED', async () => {
    context.user.status = ACCOUNT_STATUS.UNVERIFIED;
    jest
      .spyOn(context.userDA, 'findOneByEmail')
      .mockImplementation(() => context.user);
  });

  and('user status is BLOCKED', async () => {
    context.user.status = ACCOUNT_STATUS.BLOCKED;
    jest
      .spyOn(context.userDA, 'findOneByEmail')
      .mockImplementation(() => context.user);
  });

  and('expireBlockedAt is in the past', () => {
    context.user.expireBlockedAt = new Date('2024-03-09T10:05:30.915Z');
    jest
      .spyOn(context.userDA, 'findOneByEmail')
      .mockImplementation(() => context.user);
  });

  then(/^the result is that (\d+)$/, async (result) => {
    const execTimes = result !== '0' ? 1 : 0;
    expect(
      context.loginAttemptsDA.findAndUpdateLoginAttempts,
    ).toHaveBeenCalledTimes(execTimes);
  });

  and(/^actual user status is blocked (\w+)/, (isBlocked) => {
    expect(context.userDA.updateBlockedStatusByUuid).toHaveBeenCalledTimes(
      isBlocked === 'true' ? 1 : 0,
    );
  });
};
