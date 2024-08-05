import { StepDefinitions } from 'jest-cucumber';
import { getUserMockDb } from '../../../../mocks/db';
import { context, moduleFixture } from '../../../steps-config';
import { GenerateTokenPair } from '../../../../../src/domain/services';

import {
  AccountRepository,
  TokensRepository,
} from '../../../../../src/infrastructure/db/repositories';
const TTL = parseInt(process.env.ACCESS_TOKEN_TTL);

export const loginSteps: StepDefinitions = ({ given, and }) => {
  given('the POST Login API is available', async () => {
    const USER_MOCK_DB = await getUserMockDb();
    context.accountRepository =
      moduleFixture.get<AccountRepository>(AccountRepository);
    context.tokensRepository =
      moduleFixture.get<TokensRepository>(TokensRepository);
    context.generateTokenPair =
      moduleFixture.get<GenerateTokenPair>(GenerateTokenPair);
    context.path = '/v1/account/login';
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
};
