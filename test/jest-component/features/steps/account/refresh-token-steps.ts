import { StepDefinitions } from 'jest-cucumber';
import {
  context,
  generateTokenPair,
  tokensRepository,
} from '../../../steps-config';
import { PAIR_OF_TOKENS_MOCK_DB, TTL_MOCK_DB } from '../../../../mocks/db';

export const getEventsSteps: StepDefinitions = ({ given, and }) => {
  given('the POST RefreshToken API is available', () => {
    context.path = '/v1/account/refresh';

    jest.spyOn(generateTokenPair, 'generateTokens').mockResolvedValue({
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    });

    jest.spyOn(tokensRepository, 'save').mockResolvedValue();

    jest.spyOn(tokensRepository, 'removeById').mockResolvedValue();
  });

  and(/^use (\w+) refreshToken$/, (status) => {
    if (status == 'valid') {
      jest
        .spyOn(tokensRepository, 'findOneByRefreshToken')
        .mockResolvedValue(PAIR_OF_TOKENS_MOCK_DB);
      context.mock.refreshToken = 'refreshToken';
    } else if (status == 'invalid') {
      jest
        .spyOn(tokensRepository, 'findOneByRefreshToken')
        .mockResolvedValue(null);
      context.mock.refreshToken = 'invalid token';
    }
  });

  and(
    'a new accessToken and refreshToken is provided with valid ttl by env.',
    () => {
      expect(context.response.body).toMatchObject({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        ttl: TTL_MOCK_DB,
      });
    },
  );
};
