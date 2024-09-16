import { StepDefinitions } from 'jest-cucumber';
import { context, moduleFixture } from '../../../steps-config';
import { GenerateMailService } from '../../../../../src/domain/services';
import {
  AccountRepository,
  TemporalCodeRepository,
} from '../../../../../src/infrastructure/db/repositories';
import { NodemailerService } from '../../../../../src/infrastructure/services';
import { ACCOUNT_STATUS } from '../../../../../src/domain/const';
import { EMAIL_MOCK } from '../../../../mocks/dtos';
import { getUserMockDb } from '../../../../mocks/db';

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

    context.accountRepository =
      moduleFixture.get<AccountRepository>(AccountRepository);

    context.temporalCodeRepository = moduleFixture.get<TemporalCodeRepository>(
      TemporalCodeRepository,
    );

    const USER_MOCK_DB = await getUserMockDb();

    USER_MOCK_DB.status = ACCOUNT_STATUS.UNVERIFIED;

    jest
      .spyOn(context.accountRepository, 'findOneByEmail')
      .mockResolvedValue(USER_MOCK_DB);

    jest
      .spyOn(context.temporalCodeRepository, 'findAndUpdateTemporalCode')
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
      jest
        .spyOn(context.accountRepository, 'findOneByEmail')
        .mockResolvedValue(null);
    }

    if ((status = ACCOUNT_STATUS.ACTIVE)) {
      const USER_MOCK_DB = await getUserMockDb();

      const USER_MOCK_ACTIVE_DB = {
        ...USER_MOCK_DB,
        status: ACCOUNT_STATUS.ACTIVE,
      };

      jest
        .spyOn(context.accountRepository, 'findOneByEmail')
        .mockResolvedValue(USER_MOCK_ACTIVE_DB);
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
