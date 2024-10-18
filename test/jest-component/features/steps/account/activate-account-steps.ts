import { StepDefinitions } from 'jest-cucumber';
import { SessionGenerator } from '../../../../../src/domain/services';
import { context, moduleFixture } from '../../../steps-config';
import {
  VERIFICATION_CODE_DATA_MOCK_DB,
  getUserProfile,
} from '../../../../mocks/db';
import { UserDA } from '../../../../../src/infrastructure/db/modules/none/user-da';
import { SessionDA } from '../../../../../src/infrastructure/db/modules/none/session-da';
import { TemporalCodeDA } from '../../../../../src/infrastructure/db/modules/none/temporal-code-da';

export const activateAccountSteps: StepDefinitions = ({ given, and }) => {
  given('The PUT activate account API is available', async () => {
    context.path = '/v1/account/activate';

    context.mock = {
      verificationCode: '123456',
    };

    context.sessionGenerator =
      moduleFixture.get<SessionGenerator>(SessionGenerator);

    context.userDA = moduleFixture.get<UserDA>(UserDA);

    context.sessionDA = moduleFixture.get<SessionDA>(SessionDA);

    context.temporalCodeDA = moduleFixture.get<TemporalCodeDA>(TemporalCodeDA);

    const USER_PROFILE_MOCK = await getUserProfile();

    jest
      .spyOn(context.temporalCodeDA, 'findOneByCodeAndType')
      .mockResolvedValue(VERIFICATION_CODE_DATA_MOCK_DB);

    jest
      .spyOn(context.userDA, 'updateStatusByEmail')
      .mockResolvedValue(USER_PROFILE_MOCK);

    jest.spyOn(context.sessionGenerator, 'generateSession').mockResolvedValue({
      accessToken: 'ACCESS_TOKEN',
      refreshToken: 'REFRESH_TOKEN',
      sessionId: 'SESSION_ID',
    });

    jest.spyOn(context.sessionDA, 'create').mockResolvedValue(null);

    jest.spyOn(context.temporalCodeDA, 'removeById').mockResolvedValue(null);
  });

  and('verificationCode provided expired', () => {
    jest
      .spyOn(context.temporalCodeDA, 'findOneByCodeAndType')
      .mockResolvedValue(null);
  });
};
