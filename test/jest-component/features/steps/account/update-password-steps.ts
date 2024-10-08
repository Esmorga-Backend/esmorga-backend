import { StepDefinitions } from 'jest-cucumber';
import { context, moduleFixture } from '../../../steps-config';
import {
  AccountRepository,
  LoginAttemptsRepository,
  TemporalCodeRepository,
} from '../../../../../src/infrastructure/db/repositories';
import { VERIFICATION_CODE_DATA_MOCK_DB } from '../../../../mocks/db';
import { USER_MOCK_DB_ID } from '../../../../mocks/db/common';

export const updatePasswordSteps: StepDefinitions = ({ given, and }) => {
  given('The PUT password update API is available', () => {
    context.path = '/v1/account/password/forgot-update';

    context.mock = {
      password: 'SuperSecret1!',
      forgotPasswordCode: '123456',
    };

    context.accountRepository =
      moduleFixture.get<AccountRepository>(AccountRepository);

    context.temporalCodeRepository = moduleFixture.get<TemporalCodeRepository>(
      TemporalCodeRepository,
    );

    context.loginAttemptsRepository =
      moduleFixture.get<LoginAttemptsRepository>(LoginAttemptsRepository);

    jest
      .spyOn(context.temporalCodeRepository, 'findOneByCodeAndType')
      .mockResolvedValue(VERIFICATION_CODE_DATA_MOCK_DB);

    jest
      .spyOn(context.accountRepository, 'updatePasswordByEmail')
      .mockResolvedValue({ _id: USER_MOCK_DB_ID });

    jest
      .spyOn(context.temporalCodeRepository, 'removeById')
      .mockResolvedValue(null);

    jest
      .spyOn(context.loginAttemptsRepository, 'removeByUuid')
      .mockResolvedValue(null);
  });

  and('forgotPasswordCode provided expired', () => {
    jest
      .spyOn(context.temporalCodeRepository, 'findOneByCodeAndType')
      .mockResolvedValue(null);
  });
  and('counter is reset', () => {
    expect(context.loginAttemptsRepository.removeByUuid).toHaveBeenCalledWith(
      USER_MOCK_DB_ID,
    );
  });

  and('user status has changed to Active', () => {
    expect(
      context.accountRepository.updatePasswordByEmail,
    ).toHaveBeenCalledWith(
      'esmorga.test.03@yopmail.com',
      expect.stringContaining('$argon2id$v=19$m=65536'),
      true,
    );
  });
};
