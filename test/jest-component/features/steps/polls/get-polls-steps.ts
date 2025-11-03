import { JwtService } from '@nestjs/jwt';
import { StepDefinitions } from 'jest-cucumber';
import { context, moduleFixture } from '../../../steps-config';

import { HEADERS } from '../../../../mocks/common-data';
import { SESSION_ID } from '../../../../mocks/db/common';
import { PollDA } from '../../../../../src/infrastructure/db/modules/none/poll-da';
import { SessionDA } from '../../../../../src/infrastructure/db/modules/none/session-da';
import { SESSION_MOCK_DB } from '../../../../mocks/db';

export const createPollSteps: StepDefinitions = ({ given }) => {
  given('the GET Polls API is available', () => {
    context.path = '/v1/polls';
    context.method = 'get';
    context.headers = HEADERS;

    context.jwtService = moduleFixture.get<JwtService>(JwtService);

    context.sessionDA = moduleFixture.get<SessionDA>(SessionDA);

    context.pollDA = moduleFixture.get<PollDA>(PollDA);

    jest
      .spyOn(context.jwtService, 'verifyAsync')
      .mockResolvedValue({ sessionId: SESSION_ID });

    jest
      .spyOn(context.sessionDA, 'findOneBySessionId')
      .mockResolvedValue(SESSION_MOCK_DB);

    jest.spyOn(context.pollDA, 'find').mockResolvedValue([]);
  });
};
