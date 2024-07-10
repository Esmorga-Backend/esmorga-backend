import { StepDefinitions } from 'jest-cucumber';
import { context, moduleFixture } from '../../../steps-config';
import { GenerateTokenPair } from '../../../../../src/domain/services';
import {
  AccountRepository,
  TokensRepository,
} from '../../../../../src/infrastructure/db/repositories';

import { PAIR_OF_TOKENS_MOCK_DB, TTL_MOCK_DB } from '../../../../mocks/db';

export const refreshTokenSteps: StepDefinitions = ({ given, and }) => {
  given('the POST RefreshToken API is available', () => {
    context.accountRepository =
      moduleFixture.get<AccountRepository>(AccountRepository);
    context.tokensRepository =
      moduleFixture.get<TokensRepository>(TokensRepository);
    context.generateTokenPair =
      moduleFixture.get<GenerateTokenPair>(GenerateTokenPair);
    context.path = '/v1/account/refresh';
    jest
      .spyOn(context.tokensRepository, 'findOneByRefreshToken')
      .mockResolvedValue(null);

    jest.spyOn(context.generateTokenPair, 'generateTokens').mockResolvedValue({
      accessToken: 'newAccessToken',
      refreshToken: 'newRefreshToken',
    });
    jest.spyOn(context.tokensRepository, 'save').mockResolvedValue(null);

    jest.spyOn(context.tokensRepository, 'removeById').mockResolvedValue(null);
  });

  and(/^use refreshToken (\w+)$/, (refreshToken) => {
    context.mock.refreshToken = refreshToken;
    if (refreshToken === 'null') {
      context.mock.refreshToken = '';
    } else if (PAIR_OF_TOKENS_MOCK_DB.refreshToken == refreshToken) {
      jest
        .spyOn(context.tokensRepository, 'findOneByRefreshToken')
        .mockResolvedValue(PAIR_OF_TOKENS_MOCK_DB);
    }
  });

  and(
    'a new accessToken and refreshToken is provided with valid ttl by env.',
    () => {
      expect(context.response.body).toMatchObject({
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
        ttl: TTL_MOCK_DB,
      });
    },
  );
};
