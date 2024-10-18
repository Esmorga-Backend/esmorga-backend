import { StepDefinitions } from 'jest-cucumber';
import { context, moduleFixture } from '../../../steps-config';
import { GenerateMailService } from '../../../../../src/domain/services';
import { NodemailerService } from '../../../../../src/infrastructure/services';
import { ACCOUNT_STATUS } from '../../../../../src/domain/const';
import { EMAIL_MOCK } from '../../../../mocks/dtos';
import {
  getUserProfile,
  PASSWORD_MOCK_DB,
} from '../../../../mocks/db';
import {
  CleanPasswordSymbol,
  UserDA,
} from '../../../../../src/infrastructure/db/modules/none/user-da';
import { TemporalCodeDA } from '../../../../../src/infrastructure/db/modules/none/temporal-code-da';

export const sendEmailVerificationSteps: StepDefinitions = ({ given, and }) => {
  // ###### MOB-TC-182 ######
  given('the POST Email verification API is available', async () => {
    context.path = '/v1/account/email/verification';

    context.method = 'post';

    context.mock = { ...EMAIL_MOCK };

    context.generateMailService =
      moduleFixture.get<GenerateMailService>(GenerateMailService);

    context.nodemailerService =
      moduleFixture.get<NodemailerService>(NodemailerService);

    context.userDA = moduleFixture.get<UserDA>(UserDA);

    context.temporalCodeDA = moduleFixture.get<TemporalCodeDA>(TemporalCodeDA);

    const USER_MOCK_DB = await getUserProfile();

    const USER_MOCK_UNVERIFIED_DB = {
      ...USER_MOCK_DB,
      status: ACCOUNT_STATUS.UNVERIFIED,
    };

    jest
      .spyOn(context.userDA, 'findOneByEmail')
      .mockResolvedValue(USER_MOCK_UNVERIFIED_DB);

    jest
      .spyOn(context.temporalCodeDA, 'findAndUpdateTemporalCode')
      .mockResolvedValue(null);

    jest.spyOn(context.nodemailerService, 'sendEmail').mockResolvedValue(null);
  });

  and(
    /^(.*) fill correctly filled as (.*) with (.*)$/,
    async (input, inputType, inputValue) => {
      if (input === 'email' && inputType === 'number' && inputValue == 123) {
        context.mock = { ...EMAIL_MOCK, email: 123 };
      }

      if (
        input === 'email' &&
        inputType === 'string' &&
        inputValue === 'pepe'
      ) {
        context.mock = { ...EMAIL_MOCK, email: 'pepe' };
      }

      input === 'email' &&
        inputType === 'string' &&
        (inputValue === 'esmorga.test.06@yopmail.com' ||
          inputValue === 'pepe@yopmail.com');
    },
  );

  and(/^email status (.*)$/, async (status) => {
    if (status === 'null') {
      jest.spyOn(context.userDA, 'findOneByEmail').mockResolvedValue(null);
    }

    if ((status = ACCOUNT_STATUS.ACTIVE)) {
      const USER_MOCK_DB = await getUserProfile();

      jest.spyOn(context.userDA, 'findOneByEmail').mockResolvedValue({
        ...USER_MOCK_DB,
        [CleanPasswordSymbol]: PASSWORD_MOCK_DB,
      });
    }
  });

  and('none mail is sent', () => {
    expect(context.nodemailerService.sendEmail).not.toHaveBeenCalled();
  });

  // ###### MOB-TC-181 ######
  and('mail is sent', async () => {
    expect(context.nodemailerService.sendEmail).toHaveBeenCalledTimes(1);
  });
};
