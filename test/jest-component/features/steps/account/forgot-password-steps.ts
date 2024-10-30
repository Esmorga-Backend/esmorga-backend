import { StepDefinitions } from 'jest-cucumber';
import { context, moduleFixture } from '../../../steps-config';
import { GenerateMailService } from '../../../../../src/domain/services';
import { NodemailerService } from '../../../../../src/infrastructure/services';
import { getUserProfile } from '../../../../mocks/db';
import { EMAIL_MOCK } from '../../../../mocks/dtos';
import { UserDA } from '../../../../../src/infrastructure/db/modules/none/user-da';
import { TemporalCodeDA } from '../../../../../src/infrastructure/db/modules/none/temporal-code-da';

export const forgotPasswordSteps: StepDefinitions = ({ given, and, then }) => {
  given('the POST forgot password API is available', async () => {
    context.path = '/v1/account/password/forgot-init';

    context.method = 'post';

    context.mock = { ...EMAIL_MOCK };

    context.generateMailService =
      moduleFixture.get<GenerateMailService>(GenerateMailService);

    context.nodemailerService =
      moduleFixture.get<NodemailerService>(NodemailerService);

    context.userDA = moduleFixture.get<UserDA>(UserDA);

    context.temporalCodeDA = moduleFixture.get<TemporalCodeDA>(TemporalCodeDA);

    const USER_PROFILE = await getUserProfile();

    jest
      .spyOn(context.userDA, 'findOneByEmail')
      .mockResolvedValue(USER_PROFILE);

    jest
      .spyOn(context.temporalCodeDA, 'findAndUpdateTemporalCode')
      .mockResolvedValue(null);

    jest.spyOn(context.nodemailerService, 'sendEmail').mockResolvedValue(null);
  });

  and('email does not exist in DB', () => {
    jest.spyOn(context.userDA, 'findOneByEmail').mockResolvedValue(null);
  });

  then('reset password email is sent', () => {
    expect(context.nodemailerService.sendEmail).toHaveBeenCalledTimes(1);
  });

  then('reset password email is not sent', () => {
    expect(context.nodemailerService.sendEmail).not.toHaveBeenCalled();
  });
};
