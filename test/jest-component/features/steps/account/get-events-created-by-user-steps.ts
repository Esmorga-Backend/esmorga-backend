import { JwtService } from '@nestjs/jwt';
import { StepDefinitions } from 'jest-cucumber';
import { context, moduleFixture } from '../../../steps-config';
import {
  EVENT_CORE_FIELDS_MOCK_DTO,
  SESSION_MOCK_DB,
} from '../../../../mocks/db';
import { HEADERS } from '../../../../mocks/common-data';
import { SESSION_ID } from '../../../../mocks/db/common';
import { EventDA } from '../../../../../src/infrastructure/db/modules/none/event-da';
import { SessionDA } from '../../../../../src/infrastructure/db/modules/none/session-da';
import { UserDA } from '../../../../../src/infrastructure/db/modules/none/user-da';

const PATH = '/v1/account/events/created';

const METHOD = 'get';

export const getEventsCreatedByUserStepts: StepDefinitions = ({
  given,
  and,
}) => {
  given('the GET Events Created by User API is available', async () => {
    context.path = PATH;

    context.method = METHOD;

    context.headers = HEADERS;

    context.jwtService = moduleFixture.get<JwtService>(JwtService);

    context.userDA = moduleFixture.get<UserDA>(UserDA);

    context.eventDA = moduleFixture.get<EventDA>(EventDA);

    context.sessionDA = moduleFixture.get<SessionDA>(SessionDA);

    jest
      .spyOn(context.jwtService, 'verifyAsync')
      .mockResolvedValue({ sessionId: SESSION_ID });

    jest
      .spyOn(context.sessionDA, 'findOneBySessionId')
      .mockResolvedValue(SESSION_MOCK_DB);

    jest
      .spyOn(context.eventDA, 'findByEmail')
      .mockResolvedValue([EVENT_CORE_FIELDS_MOCK_DTO]);
  });

  and('there are not upcoming events', () => {
    jest.spyOn(context.eventDA, 'findByEmail').mockResolvedValue([]);
  });
};
