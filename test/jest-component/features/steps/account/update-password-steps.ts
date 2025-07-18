import { JwtService } from '@nestjs/jwt';
import { StepDefinitions } from 'jest-cucumber';
import { context, moduleFixture } from '../../../steps-config';
import { SessionGenerator } from '../../../../../src/domain/services';
import { HEADERS } from '../../../../mocks/common-data';
import { SESSION_ID, USER_MOCK_DB_ID } from '../../../../mocks/db/common';
import { UserDA } from '../../../../../src/infrastructure/db/modules/none/user-da';
import { SessionDA } from '../../../../../src/infrastructure/db/modules/none/session-da';

export const updatePasswordSteps: StepDefinitions = ({ given, and, then }) => {
  given('the PUT Update Password API is available', () => {
    context.path = '/v1/account/password';

    context.headers = HEADERS;

    context.mock = {
      currentPassword: 'SuperSecret1!',
      newPassword: 'SuperSecret2!',
    };

    context.userDA = moduleFixture.get<UserDA>(UserDA);
    context.sessionDA = moduleFixture.get<SessionDA>(SessionDA);
    context.sessionGenerator =
      moduleFixture.get<SessionGenerator>(SessionGenerator);
    context.jwtService = moduleFixture.get<JwtService>(JwtService);

    jest
      .spyOn(context.jwtService, 'verifyAsync')
      .mockResolvedValue({ sessionId: SESSION_ID });

    jest
      .spyOn(context.sessionDA, 'findOneBySessionId')
      .mockResolvedValue({ uuid: USER_MOCK_DB_ID });

    jest.spyOn(context.userDA, 'updatePasswordByUuid').mockResolvedValue(true);

    jest.spyOn(context.sessionDA, 'removeAllByUuid').mockResolvedValue(null);

    jest.spyOn(context.sessionGenerator, 'generateSession').mockResolvedValue({
      accessToken: 'newAccessToken',
      refreshToken: 'newRefreshToken',
      sessionId: 'SESSION_ID',
    });

    jest.spyOn(context.sessionDA, 'create').mockResolvedValue(null);
  });

  and('currentPassword and newPassword are the same', () => {
    context.mock = {
      currentPassword: 'SuperSecret1!',
      newPassword: 'SuperSecret1!',
    };
  });

  then('close all sessions is called', () => {
    expect(context.sessionDA.removeAllByUuid).toHaveBeenCalled();
  });

  and('the currentPassword does not match the stored password', () => {
    jest.spyOn(context.userDA, 'updatePasswordByUuid').mockResolvedValue(false);
  });
};
