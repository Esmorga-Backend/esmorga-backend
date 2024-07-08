import { StepDefinitions } from 'jest-cucumber';
import {
  accountRepository,
  context,
  generateTokenPair,
  tokensRepository,
} from '../../../steps-config';
import { USER_MOCK_DB } from '../../../../mocks/db';
import { ACCOUNT_REGISTER } from '../../../../mocks/dtos';

//const TTL = parseInt(process.env.ACCESS_TOKEN_TTL);

export const registerSteps: StepDefinitions = ({ given, and }) => {
  given('the POST Register API is available', () => {
    context.mock = { ...ACCOUNT_REGISTER };
    context.path = '/v1/account/register';
    context.mockDb = jest.spyOn(accountRepository, 'save').mockResolvedValue();
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

  and('a registered user is entered', () => {
    context.mockDb.mockRestore();
    jest.spyOn(accountRepository, 'save').mockRejectedValue({ code: 11000 });
  });
};
