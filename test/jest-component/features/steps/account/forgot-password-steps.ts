import { StepDefinitions } from 'jest-cucumber';
import { context, moduleFixture } from '../../../steps-config';
import { EMAIL_MOCK } from '../../../../mocks/dtos';
import {
  AccountRepository,
  TemporalCodeRepository,
} from '../../../../../src/infrastructure/db/repositories';
import { GenerateMailService } from '../../../../../src/domain/services';
import { NodemailerService } from '../../../../../src/infrastructure/services';
import { getUserMockDb } from '../../../../mocks/db';

export const forgotPasswordSteps: StepDefinitions = ({ given, and, when }) => {
  given('the POST forgot password API is available', async () => {
    context.path = '/v1/account/password/forgot-init';
    context.method = 'post';
    context.mock = { ...EMAIL_MOCK };

    context.accountRepository =
      moduleFixture.get<AccountRepository>(AccountRepository);

    context.temporalCodeRepository = moduleFixture.get<TemporalCodeRepository>(
      TemporalCodeRepository,
    );

    context.generateMailService =
      moduleFixture.get<GenerateMailService>(GenerateMailService);

    context.nodemailerService =
      moduleFixture.get<NodemailerService>(NodemailerService);

    jest
      .spyOn(context.accountRepository, 'findOneByEmail')
      .mockResolvedValue(null);

    jest
      .spyOn(context.temporalCodeRepository, 'findAndUpdateTemporalCode')
      .mockResolvedValue(null);

    jest.spyOn(context.nodemailerService, 'sendEmail').mockResolvedValue(null);
  });

  when('email correctly filled', () => {});

  and('email already existing in DB', async () => {
    const USER_MOCK_DB = await getUserMockDb();
    jest
      .spyOn(context.accountRepository, 'findOneByEmail')
      .mockResolvedValue(USER_MOCK_DB);
  });

  and('reset password email is sent', () => {
    expect(context.nodemailerService.sendEmail).toHaveBeenCalledTimes(1);
  });
};
