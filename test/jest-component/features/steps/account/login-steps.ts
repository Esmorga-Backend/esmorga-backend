import { StepDefinitions } from 'jest-cucumber';
import {
  accountRepository,
  context,
  generateTokenPair,
  tokensRepository,
} from '../../../steps-config';
import { getUserMockDb } from '../../../../mocks/db';

const TTL = parseInt(process.env.ACCESS_TOKEN_TTL);

export const loginSteps: StepDefinitions = ({ given, and }) => {
  given('the POST Login API is available', async () => {
    const USER_MOCK_DB = await getUserMockDb();

    context.path = '/v1/account/login';
    jest
      .spyOn(accountRepository, 'findOneByEmail')
      .mockResolvedValue(USER_MOCK_DB);

    jest.spyOn(generateTokenPair, 'generateTokens').mockResolvedValue({
      accessToken: 'ACCESS_TOKEN',
      refreshToken: 'REFRESH_TOKEN',
    });

    jest.spyOn(tokensRepository, 'findByUuid').mockResolvedValue([]);

    jest.spyOn(tokensRepository, 'save').mockResolvedValue();
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
