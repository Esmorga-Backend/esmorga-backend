import { JwtService } from '@nestjs/jwt';
import { StepDefinitions } from 'jest-cucumber';
import { context, moduleFixture } from '../../../steps-config';
import { SESSION_MOCK_DB, getUserProfile } from '../../../../mocks/db';
import { HEADERS } from '../../../../mocks/common-data';
import { SESSION_ID } from '../../../../mocks/db/common';
import { SessionDA } from '../../../../../src/infrastructure/db/modules/none/session-da';
import { UserDA } from '../../../../../src/infrastructure/db/modules/none/user-da';

const PATH = '/v1/account/profile';

const METHOD = 'get';

export const getProfileStepts: StepDefinitions = ({ given }) => {
  given('the GET Account Profile API is available', async () => {
    context.path = PATH;

    context.method = METHOD;

    context.headers = HEADERS;

    context.jwtService = moduleFixture.get<JwtService>(JwtService);

    context.sessionDA = moduleFixture.get<SessionDA>(SessionDA);

    context.userDA = moduleFixture.get<UserDA>(UserDA);

    jest
      .spyOn(context.jwtService, 'verifyAsync')
      .mockResolvedValue({ sessionId: SESSION_ID });

    jest
      .spyOn(context.sessionDA, 'findOneBySessionId')
      .mockResolvedValue(SESSION_MOCK_DB);

    const USER = await getUserProfile();

    jest.spyOn(context.userDA, 'findOneById').mockResolvedValue(USER);
  });
};
