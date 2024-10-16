import { StepDefinitions } from 'jest-cucumber';
import {
  AccountRepository,
  TokensRepository,
  TemporalCodeRepository,
} from '../../../../../src/infrastructure/db/repositories';
import { SessionGenerator } from '../../../../../src/domain/services';
import { context, moduleFixture } from '../../../steps-config';
import {
  VERIFICATION_CODE_DATA_MOCK_DB,
  getUserMockDb,
} from '../../../../mocks/db';

export const activateAccountSteps: StepDefinitions = ({ given, and }) => {
  given('The PUT activate account API is available', async () => {
    context.path = '/v1/account/activate';

    context.mock = {
      verificationCode: '123456',
    };

    context.generateTokenPair =
      moduleFixture.get<SessionGenerator>(SessionGenerator);

    context.accountRepository =
      moduleFixture.get<AccountRepository>(AccountRepository);

    context.tokensRepository =
      moduleFixture.get<TokensRepository>(TokensRepository);

    context.temporalCodeRepository = moduleFixture.get<TemporalCodeRepository>(
      TemporalCodeRepository,
    );

    const USER_MOCK_DB = await getUserMockDb();

    jest
      .spyOn(context.temporalCodeRepository, 'findOneByCodeAndType')
      .mockResolvedValue(VERIFICATION_CODE_DATA_MOCK_DB);

    jest
      .spyOn(context.accountRepository, 'updateStatusByEmail')
      .mockResolvedValue(USER_MOCK_DB);

    jest.spyOn(context.generateTokenPair, 'generateTokens').mockResolvedValue({
      accessToken: 'ACCESS_TOKEN',
      refreshToken: 'REFRESH_TOKEN',
    });

    jest.spyOn(context.tokensRepository, 'save').mockResolvedValue(null);

    jest
      .spyOn(context.temporalCodeRepository, 'removeById')
      .mockResolvedValue(null);
  });

  and('verificationCode provided expired', () => {
    jest
      .spyOn(context.temporalCodeRepository, 'findOneByCodeAndType')
      .mockResolvedValue(null);
  });
};
