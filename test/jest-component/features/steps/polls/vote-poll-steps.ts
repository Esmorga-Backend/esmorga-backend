import { JwtService } from '@nestjs/jwt';
import { StepDefinitions } from 'jest-cucumber';
import { context, moduleFixture } from '../../../steps-config';

import { HEADERS } from '../../../../mocks/common-data';
import { SESSION_ID } from '../../../../mocks/db/common';
import { PollDA } from '../../../../../src/infrastructure/db/modules/none/poll-da';
import { SessionDA } from '../../../../../src/infrastructure/db/modules/none/session-da';
import { SESSION_MOCK_DB } from '../../../../mocks/db';
import { POLL_MOCK } from '../../../../mocks/dtos';

export const createPollSteps: StepDefinitions = ({ given, and }) => {
  given('the POST Answer Poll API is available', () => {
    context.path = `/v1/polls/${POLL_MOCK.pollId}/vote`;
    context.method = 'post';
    context.headers = HEADERS;

    context.jwtService = moduleFixture.get<JwtService>(JwtService);

    context.sessionDA = moduleFixture.get<SessionDA>(SessionDA);

    context.pollDA = moduleFixture.get<PollDA>(PollDA);

    context.mock = {
      selectedOptions: [POLL_MOCK.options[0].optionId],
    };

    jest
      .spyOn(context.jwtService, 'verifyAsync')
      .mockResolvedValue({ sessionId: SESSION_ID });

    jest
      .spyOn(context.sessionDA, 'findOneBySessionId')
      .mockResolvedValue(SESSION_MOCK_DB);

    jest.spyOn(context.pollDA, 'findOneById').mockResolvedValue(POLL_MOCK);

    jest.spyOn(context.pollDA, 'vote').mockResolvedValue(POLL_MOCK);
  });

  and('I send an invalid pollId', async () => {
    jest.spyOn(context.pollDA, 'findOneById').mockResolvedValue(null);
  });

  and('I try to vote a poll with a past deadline', () => {
    jest.spyOn(context.pollDA, 'findOneById').mockResolvedValue({
      ...POLL_MOCK,
      voteDeadline: new Date(Date.now() - 1000),
    });
  });

  and('the poll is single choice', () => {
    jest.spyOn(context.pollDA, 'findOneById').mockResolvedValue({
      ...POLL_MOCK,
      isMultipleChoice: false,
    });
  });

  and('my request body contains multiple optionIds', () => {
    context.mock = {
      selectedOptions: [
        POLL_MOCK.options[0].optionId,
        POLL_MOCK.options[1].optionId,
      ],
    };
  });
};
