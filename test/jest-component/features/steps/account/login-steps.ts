import { StepDefinitions } from 'jest-cucumber';
import {
  accountRepository,
  context,
  generateTokenPair,
  tokensRepository,
} from '../../../steps-config';
import { USER_DB } from '../../../../mocks/db';

const TTL = parseInt(process.env.ACCESS_TOKEN_TTL);

export const getEventsSteps: StepDefinitions = ({ given, and }) => {
  given('the POST Login API is available', () => {
    context.path = '/v1/account/login';
    jest.spyOn(accountRepository, 'findOneByEmail').mockResolvedValue(USER_DB);

    jest.spyOn(generateTokenPair, 'generateTokens').mockResolvedValue({
      accessToken: 'ACCESS_TOKEN',
      refreshToken: 'REFRESH_TOKEN',
    });

    jest.spyOn(tokensRepository, 'findByUuid').mockResolvedValue([]);

    jest.spyOn(tokensRepository, 'save').mockResolvedValue();
  });
  and(/^email field correctly filled with (.*)$/, (email) => {
    context.mock.email = email;
  });

  and(/^password field correctly filled with (.*)$/, (password) => {
    context.mock.password = password;
  });

  and(
    'profile, accessToken and refreshToken are provided with correct schema',
    () => {
      expect(context.response.body).toMatchObject({
        accessToken: 'ACCESS_TOKEN',
        refreshToken: 'REFRESH_TOKEN',
        ttl: TTL,
        profile: {
          name: USER_DB.name,
          email: USER_DB.email,
        },
      });
    },
  );
};
