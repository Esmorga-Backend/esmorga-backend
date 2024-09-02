import { StepDefinitions } from 'jest-cucumber';
import { context, moduleFixture } from '../../../steps-config';
import { GenerateMailService } from '../../../../../src/domain/services';
import {
  AccountRepository,
  VerificationCodeRepository,
} from '../../../../../src/infrastructure/db/repositories';
import { ACCOUNT_REGISTER } from '../../../../mocks/dtos';
import { getUserMockDb } from '../../../../mocks/db';
import { NodemailerService } from '../../../../../src/infrastructure/services';

export const registerSteps: StepDefinitions = ({ given, and }) => {
  given('the POST Register API is available', async () => {
    context.generateMailService =
      moduleFixture.get<GenerateMailService>(GenerateMailService);

    context.nodemailerService =
      moduleFixture.get<NodemailerService>(NodemailerService);

    context.accountRepository =
      moduleFixture.get<AccountRepository>(AccountRepository);

    context.verificationCodeRepository =
      moduleFixture.get<VerificationCodeRepository>(VerificationCodeRepository);

    context.mock = { ...ACCOUNT_REGISTER };
    context.path = '/v1/account/register';

    jest
      .spyOn(context.accountRepository, 'findOneByEmail')
      .mockResolvedValue(null);

    jest.spyOn(context.accountRepository, 'save').mockResolvedValue(null);

    jest
      .spyOn(
        context.verificationCodeRepository,
        'findAndUpdateVerificationCode',
      )
      .mockResolvedValue(null);

    jest.spyOn(context.nodemailerService, 'sendEmail').mockResolvedValue(null);
  });

  and('a registered user is entered', async () => {
    const USER_MOCK_DB = await getUserMockDb();

    jest
      .spyOn(context.accountRepository, 'findOneByEmail')
      .mockResolvedValue(USER_MOCK_DB);
  });

  and('account confirmation email is sent', () => {
    expect(context.nodemailerService.sendEmail).toHaveBeenCalled();
  });
};
