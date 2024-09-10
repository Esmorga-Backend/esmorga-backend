import { StepDefinitions } from 'jest-cucumber';
import { context, moduleFixture } from '../../../steps-config';
import {
  AccountRepository,
  TemporalCodeRepository,
} from '../../../../../src/infrastructure/db/repositories';
import { VERIFICATION_CODE_DATA_MOCK_DB } from '../../../../mocks/db';

export const updatePasswordSteps: StepDefinitions = ({ given }) => {
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

    jest
      .spyOn(context.temporalCodeRepository, 'findOneByCodeAndType')
      .mockResolvedValue(VERIFICATION_CODE_DATA_MOCK_DB);

    jest
      .spyOn(context.accountRepository, 'updatePasswordByEmail')
      .mockResolvedValue(null);

    jest
      .spyOn(context.temporalCodeRepository, 'removeById')
      .mockResolvedValue(null);
  });
};
