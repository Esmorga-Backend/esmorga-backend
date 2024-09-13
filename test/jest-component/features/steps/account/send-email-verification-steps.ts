import { StepDefinitions } from 'jest-cucumber';
import { context, moduleFixture } from '../../../steps-config';
import { GenerateMailService } from '../../../../../src/domain/services';
import {
  AccountRepository,
  TemporalCodeRepository,
} from '../../../../../src/infrastructure/db/repositories';
import { EMAIL_MOCK } from '../../../../mocks/dtos';
import { getUserMockDb } from '../../../../mocks/db';
import { NodemailerService } from '../../../../../src/infrastructure/services';

export const sendEmailVerificationSteps: StepDefinitions = ({
  given,
  and,
  then,
}) => {
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

    USER_MOCK_DB.status = 'UNVERIFIED';

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
      if (
        input === 'email' &&
        inputType === 'number' &&
        (inputValue === 123 || inputValue === 'pepe')
      ) {
        jest
          .spyOn(context.accountRepository, 'findOneByEmail')
          .mockResolvedValue(null);
      }

      if (
        input === 'email' &&
        inputType === 'string' &&
        inputValue === 'esmorga.test.06@yopmail.com'
      ) {
        const USER_MOCK_DB = await getUserMockDb();

        jest
          .spyOn(context.accountRepository, 'findOneByEmail')
          .mockResolvedValue(USER_MOCK_DB);
      }
    },
  );

  and(/^email status (.*)$/, (status) => {
    if (status === 'null' || status === 'ACTIVE') {
      expect(context.nodemailerService.sendEmail).not.toHaveBeenCalled();
    }
  });

  then(
    /^well-formed response with status code (.*) returned$/,
    (responseCode) => {
      if (responseCode === 400 || responseCode === 204) {
        expect(context.nodemailerService.sendEmail).not.toHaveBeenCalled();
      }
    },
  );

  and('none mail is sent', () => {
    expect(context.nodemailerService.sendEmail).not.toHaveBeenCalled();
  });

  // ###### MOB-TC-181 ######
  and('mail is sent', () => {
    jest
      .spyOn(context.accountRepository, 'findOneByEmail')
      .mockResolvedValue({});
    console.log('***>>>>');
    // const USER_MOCK_DB = await getUserMockDb();

    // USER_MOCK_DB.status = 'UNVERIFIED';

    // jest
    //   .spyOn(context.accountRepository, 'findOneByEmail')
    //   .mockResolvedValue(USER_MOCK_DB);

    expect(context.nodemailerService.sendEmail).toHaveBeenCalledTimes(1);
  });
};
