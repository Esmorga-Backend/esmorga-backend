import { JwtService } from '@nestjs/jwt';
import { StepDefinitions } from 'jest-cucumber';
import { context, moduleFixture } from '../../../steps-config';
import {
  FUTURE_EVENT_MOCK_DTO,
  SESSION_MOCK_DB,
  getUserProfile,
} from '../../../../mocks/db';
import { EVENT_ID_MOCK } from '../../../../mocks/dtos';
import { HEADERS } from '../../../../mocks/common-data';
import { ACCOUNT_ROLES } from '../../../../../src/domain/const';
import { SESSION_ID } from '../../../../mocks/db/common';
import { UserDA } from '../../../../../src/infrastructure/db/modules/none/user-da';
import { SessionDA } from '../../../../../src/infrastructure/db/modules/none/session-da';
import { EventDA } from '../../../../../src/infrastructure/db/modules/none/event-da';
import { EventParticipantsDA } from '../../../../../src/infrastructure/db/modules/none/event-participant-da';

const PATH = '/v1/events';

const METHOD = 'delete';

const BODY = { ...EVENT_ID_MOCK };

export const deleteEventStep: StepDefinitions = ({ given, and }) => {
  // ###### MOB-TC-35 ######
  given('the DELETE Event API is available', () => {
    context.path = PATH;

    context.method = METHOD;

    context.mock = BODY;

    context.headers = HEADERS;

    context.jwtService = moduleFixture.get<JwtService>(JwtService);

    context.eventDA = moduleFixture.get<EventDA>(EventDA);

    context.userDA = moduleFixture.get<UserDA>(UserDA);

    context.sessionDA = moduleFixture.get<SessionDA>(SessionDA);

    context.eventParticipantsDA =
      moduleFixture.get<EventParticipantsDA>(EventParticipantsDA);

    jest.spyOn(context.eventDA, 'removeById').mockResolvedValue(null);

    jest
      .spyOn(context.eventParticipantsDA, 'removeByEventId')
      .mockResolvedValue(null);
  });

  and('use accessToken valid and eventId event_exist', async () => {
    const ADMIN_USER = {
      ...(await getUserProfile()),
      role: ACCOUNT_ROLES.ADMIN,
    };

    jest
      .spyOn(context.jwtService, 'verifyAsync')
      .mockResolvedValue({ sessionId: SESSION_ID });

    jest
      .spyOn(context.sessionDA, 'findOneBySessionId')
      .mockResolvedValue(SESSION_MOCK_DB);

    jest.spyOn(context.userDA, 'findOneById').mockResolvedValue(ADMIN_USER);

    jest
      .spyOn(context.eventDA, 'findOneById')
      .mockResolvedValue(FUTURE_EVENT_MOCK_DTO);
  });

  // ###### MOB-TC-36 ######
  and('use accessToken is valid and eventId do not exist', () => {
    jest.spyOn(context.eventDA, 'findOneById').mockResolvedValue(null);
    jest
      .spyOn(context.jwtService, 'verifyAsync')
      .mockResolvedValue({ sessionId: SESSION_ID });

    jest.spyOn(context.sessionDA, 'findOneBySessionId').mockResolvedValue(null);
  });

  // ###### MOB-TC-37 ######
  and('use accessToken invalid and eventId event_exist', () => {
    jest.spyOn(context.jwtService, 'verifyAsync').mockRejectedValue({});
  });

  // ###### MOB-TC-38 ######
  and(
    'use accessToken without enough privileges and eventId event_exist',
    async () => {
      const USER = await getUserProfile();

      jest
        .spyOn(context.jwtService, 'verifyAsync')
        .mockResolvedValue({ sessionId: SESSION_ID });

      jest
        .spyOn(context.sessionDA, 'findOneBySessionId')
        .mockResolvedValue(SESSION_MOCK_DB);

      jest.spyOn(context.userDA, 'findOneById').mockResolvedValue(USER);

      jest
        .spyOn(context.eventDA, 'findOneById')
        .mockResolvedValue(FUTURE_EVENT_MOCK_DTO);
    },
  );
};
