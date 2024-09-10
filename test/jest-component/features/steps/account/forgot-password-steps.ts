import { StepDefinitions } from 'jest-cucumber';
import { context, moduleFixture } from '../../../steps-config';
import {
  AccountRepository,
  TemporalCodeRepository,
} from '../../../../../src/infrastructure/db/repositories';
import { GenerateMailService } from '../../../../../src/domain/services';
import { NodemailerService } from '../../../../../src/infrastructure/services';
import { getUserMockDb } from '../../../../mocks/db';
import { EMAIL_MOCK } from '../../../../mocks/dtos';

export const forgotPasswordSteps: StepDefinitions = ({ given, and, then }) => {
  given('the POST forgot password API is available', async () => {
    context.path = '/v1/account/password/forgot-init';

    context.method = 'post';

    context.mock = { ...EMAIL_MOCK };

    context.generateMailService =
      moduleFixture.get<GenerateMailService>(GenerateMailService);

    context.nodemailerService =
      moduleFixture.get<NodemailerService>(NodemailerService);

    context.accountRepository =
      moduleFixture.get<AccountRepository>(AccountRepository);

    context.temporalCodeRepository = moduleFixture.get<TemporalCodeRepository>(
      TemporalCodeRepository,
    );

    const USER_MOCK_DB = await getUserMockDb();

    jest
      .spyOn(context.accountRepository, 'findOneByEmail')
      .mockResolvedValue(USER_MOCK_DB);

    jest
      .spyOn(context.temporalCodeRepository, 'findAndUpdateTemporalCode')
      .mockResolvedValue(null);

    jest.spyOn(context.nodemailerService, 'sendEmail').mockResolvedValue(null);
  });

  and('email does not exist in DB', () => {
    jest
      .spyOn(context.accountRepository, 'findOneByEmail')
      .mockResolvedValue(null);
  });

  then('reset password email is sent', () => {
    expect(context.nodemailerService.sendEmail).toHaveBeenCalledTimes(1);
  });

  then('reset password email is not sent', () => {
    expect(context.nodemailerService.sendEmail).not.toHaveBeenCalled();
  });
};
