import { JwtService } from '@nestjs/jwt';
import { StepDefinitions } from 'jest-cucumber';
import { context, moduleFixture } from '../../../steps-config';
import { EVENT_MOCK } from '../../../../mocks/dtos';
import { HEADERS } from '../../../../mocks/common-data';
import {
  EVENT_PARTICIPANT_MOCK_DB,
  getUserProfile,
  SESSION_MOCK_DB,
} from '../../../../mocks/db';
import { UserDA } from '../../../../../src/infrastructure/db/modules/none/user-da';
import { SessionDA } from '../../../../../src/infrastructure/db/modules/none/session-da';
import { EventParticipantsDA } from '../../../../../src/infrastructure/db/modules/none/event-participant-da';
import { SESSION_ID } from '../../../../mocks/db/common';
import { EventDA } from '../../../../../src/infrastructure/db/modules/none/event-da';

export const getEventUsersList: StepDefinitions = ({ given, and }) => {
  given('the GET List of users API is available', async () => {
    context.path = `/v1/events/${EVENT_MOCK.eventId}/users`;
    context.method = 'get';
    context.headers = HEADERS;

    context.jwtService = moduleFixture.get<JwtService>(JwtService);

    context.sessionDA = moduleFixture.get<SessionDA>(SessionDA);

    context.userDA = moduleFixture.get<UserDA>(UserDA);

    context.eventDA = moduleFixture.get<EventDA>(EventDA);

    context.eventParticipantsDA =
      moduleFixture.get<EventParticipantsDA>(EventParticipantsDA);

    jest
      .spyOn(context.jwtService, 'verifyAsync')
      .mockResolvedValue({ sessionId: SESSION_ID });

    jest
      .spyOn(context.sessionDA, 'findOneBySessionId')
      .mockResolvedValue(SESSION_MOCK_DB);

    jest.spyOn(context.eventDA, 'findOneById').mockResolvedValue(EVENT_MOCK);

    jest
      .spyOn(context.eventParticipantsDA, 'findEvent')
      .mockResolvedValue(EVENT_PARTICIPANT_MOCK_DB);

    const USER_MOCK_DB = await getUserProfile();

    jest
      .spyOn(context.userDA, 'findUsersByUuids')
      .mockResolvedValue([USER_MOCK_DB]);
  });

  and('there are not upcoming users joined', async () => {
    jest
      .spyOn(context.eventParticipantsDA, 'findEvent')
      .mockResolvedValue(null);
  });

  and('the response must include an empty users array', () => {
    expect(context.response.body).toEqual({
      totalUsers: 0,
      users: [],
    });
  });
};
