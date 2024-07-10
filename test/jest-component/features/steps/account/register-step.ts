import { StepDefinitions } from 'jest-cucumber';
import { context, moduleFixture } from '../../../steps-config';
import { GenerateTokenPair } from '../../../../../src/domain/services';
import {
  AccountRepository,
  TokensRepository,
} from '../../../../../src/infrastructure/db/repositories';
import { ACCOUNT_REGISTER } from '../../../../mocks/dtos';
import { getUserMockDb } from '../../../../mocks/db';

export const registerSteps: StepDefinitions = ({ given, and }) => {
  given('the POST Register API is available', async () => {
    context.accountRepository =
      moduleFixture.get<AccountRepository>(AccountRepository);
    context.tokensRepository =
      moduleFixture.get<TokensRepository>(TokensRepository);
    context.generateTokenPair =
      moduleFixture.get<GenerateTokenPair>(GenerateTokenPair);
    const USER_MOCK_DB = await getUserMockDb();
    context.mock = { ...ACCOUNT_REGISTER };
    context.path = '/v1/account/register';
    jest.spyOn(context.accountRepository, 'save').mockResolvedValue(null);
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

  and('a registered user is entered', () => {
    jest
      .spyOn(context.accountRepository, 'save')
      .mockRejectedValue({ code: 11000 });
  });
};
