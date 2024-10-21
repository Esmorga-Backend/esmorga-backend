import { StepDefinitions } from 'jest-cucumber';
import { context, moduleFixture } from '../../../steps-config';
import { USER_MOCK_DB_ID } from '../../../../mocks/db/common';
import {
  getUserProfile,
  PASSWORD_MOCK_DB,
  VERIFICATION_CODE_DATA_MOCK_DB,
} from '../../../../mocks/db';
import {
  PasswordSymbol,
  UserDA,
} from '../../../../../src/infrastructure/db/modules/none/user-da';
import { TemporalCodeDA } from '../../../../../src/infrastructure/db/modules/none/temporal-code-da';
import { LoginAttemptsDA } from '../../../../../src/infrastructure/db/modules/none/login-attempts-da';

export const updatePasswordSteps: StepDefinitions = ({ given, and }) => {
  given('The PUT password update API is available', async () => {
    context.path = '/v1/account/password/forgot-update';

    context.user = {
      ...(await getUserProfile()),
      [PasswordSymbol]: PASSWORD_MOCK_DB,
    };

    context.mock = {
      password: 'SuperSecret1!',
      forgotPasswordCode: '123456',
    };

    context.userDA = moduleFixture.get<UserDA>(UserDA);

    context.temporalCodeDA = moduleFixture.get<TemporalCodeDA>(TemporalCodeDA);

    context.loginAttemptsDA =
      moduleFixture.get<LoginAttemptsDA>(LoginAttemptsDA);

    jest
      .spyOn(context.temporalCodeDA, 'findOneByCodeAndType')
      .mockResolvedValue(VERIFICATION_CODE_DATA_MOCK_DB);

    jest
      .spyOn(context.userDA, 'updatePasswordByEmail')
      .mockResolvedValue(getUserProfile());

    jest
      .spyOn(context.userDA, 'updateBlockedStatusByUuid')
      .mockResolvedValue(null);

    jest.spyOn(context.temporalCodeDA, 'removeById').mockResolvedValue(null);

    jest.spyOn(context.loginAttemptsDA, 'removeByUuid').mockResolvedValue(null);
  });

  and('forgotPasswordCode provided expired', () => {
    jest
      .spyOn(context.temporalCodeDA, 'findOneByCodeAndType')
      .mockResolvedValue(null);
  });

  and('counter is reset', () => {
    expect(context.loginAttemptsDA.removeByUuid).toHaveBeenCalledWith(
      USER_MOCK_DB_ID,
    );
  });

  and('user status has changed to ACTIVE', () => {
    expect(context.userDA.updatePasswordByEmail).toHaveBeenCalledWith(
      'esmorga.test.03@yopmail.com',
      expect.stringContaining('$argon2id$v=19$m=65536'),
    );
  });
};
