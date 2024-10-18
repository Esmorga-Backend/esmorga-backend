import { StepDefinitions } from 'jest-cucumber';
import { context, moduleFixture } from '../../../steps-config';
import { GenerateMailService } from '../../../../../src/domain/services';
import { ACCOUNT_REGISTER } from '../../../../mocks/dtos';
import { NodemailerService } from '../../../../../src/infrastructure/services';
import { UserDA } from '../../../../../src/infrastructure/db/modules/none/user-da';
import { TemporalCodeDA } from '../../../../../src/infrastructure/db/modules/none/temporal-code-da';
import { getUserProfile } from '../../../../mocks/db';

export const registerSteps: StepDefinitions = ({ given, and }) => {
  given('the POST Register API is available', async () => {
    context.generateMailService =
      moduleFixture.get<GenerateMailService>(GenerateMailService);

    context.nodemailerService =
      moduleFixture.get<NodemailerService>(NodemailerService);

    context.userDA = moduleFixture.get<UserDA>(UserDA);

    context.temporalCodeDA = moduleFixture.get<TemporalCodeDA>(TemporalCodeDA);

    context.mock = { ...ACCOUNT_REGISTER };
    context.path = '/v1/account/register';

    jest.spyOn(context.userDA, 'findOneByEmail').mockResolvedValue(null);

    jest.spyOn(context.userDA, 'create').mockResolvedValue(null);

    jest
      .spyOn(context.temporalCodeDA, 'findAndUpdateTemporalCode')
      .mockResolvedValue(null);

    jest.spyOn(context.nodemailerService, 'sendEmail').mockResolvedValue(null);
  });

  and('a registered user is entered', async () => {
    const USER_MOCK_DB = await getUserProfile();

    jest
      .spyOn(context.userDA, 'findOneByEmail')
      .mockResolvedValue(USER_MOCK_DB);
  });

  and('account confirmation email is sent', () => {
    expect(context.nodemailerService.sendEmail).toHaveBeenCalled();
  });

  and('account confirmation email is not sent', () => {
    expect(context.nodemailerService.sendEmail).not.toHaveBeenCalled();
  });
};
