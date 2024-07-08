import { StepDefinitions } from 'jest-cucumber';
import {
  context,
  generateTokenPair,
  tokensRepository,
} from '../../../steps-config';
import { PAIR_OF_TOKENS_MOCK_DB, TTL_MOCK_DB } from '../../../../mocks/db';

export const refreshTokenSteps: StepDefinitions = ({ given, and }) => {
  given('the POST RefreshToken API is available', () => {
    context.path = '/v1/account/refresh';
    jest
      .spyOn(tokensRepository, 'findOneByRefreshToken')
      .mockResolvedValue(null);

    jest.spyOn(generateTokenPair, 'generateTokens').mockResolvedValue({
      accessToken: 'newAccessToken',
      refreshToken: 'newRefreshToken',
    });
    jest.spyOn(tokensRepository, 'save').mockResolvedValue();

    jest.spyOn(tokensRepository, 'removeById').mockResolvedValue();
  });

  and(/^use refreshToken (\w+)$/, (refreshToken) => {
    context.mock.refreshToken = refreshToken;
    if (refreshToken == 'null') {
      context.mock.refreshToken = '';
    } else if (PAIR_OF_TOKENS_MOCK_DB.refreshToken == refreshToken) {
      jest
        .spyOn(tokensRepository, 'findOneByRefreshToken')
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
