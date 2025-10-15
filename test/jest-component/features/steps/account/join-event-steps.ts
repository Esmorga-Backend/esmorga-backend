import { JwtService } from '@nestjs/jwt';
import { StepDefinitions } from 'jest-cucumber';
import { context, moduleFixture } from '../../../steps-config';
import {
  FUTURE_EVENT_MOCK_DTO,
  OLD_EVENT_MOCK_DTO,
  SESSION_MOCK_DB,
} from '../../../../mocks/db';
import { EVENT_ID_MOCK } from '../../../../mocks/dtos';
import { HEADERS } from '../../../../mocks/common-data';
import { SESSION_ID } from '../../../../mocks/db/common';
import { EventDA } from '../../../../../src/infrastructure/db/modules/none/event-da';
import { SessionDA } from '../../../../../src/infrastructure/db/modules/none/session-da';
import { EventParticipantsDA } from '../../../../../src/infrastructure/db/modules/none/event-participant-da';

const PATH = '/v1/account/events';

const METHOD = 'post';

const BODY = { ...EVENT_ID_MOCK };

export const joinEventSteps: StepDefinitions = ({ given, and }) => {
  // ###### MOB-TC-53 ######
  given('the POST Join event API is available', () => {
    context.path = PATH;

    context.method = METHOD;

    context.mock = BODY;

    context.jwtService = moduleFixture.get<JwtService>(JwtService);

    context.eventDA = moduleFixture.get<EventDA>(EventDA);

    context.sessionDA = moduleFixture.get<SessionDA>(SessionDA);

    context.eventParticipantsDA =
      moduleFixture.get<EventParticipantsDA>(EventParticipantsDA);

    jest
      .spyOn(context.eventParticipantsDA, 'findAndUpdateParticipantsList')
      .mockResolvedValue(true);

    jest
      .spyOn(context.eventDA, 'incrementAttendeeCount')
      .mockResolvedValue(null);
  });

  and('I am authenticated, with valid accessToken and eventId', () => {
    context.headers = HEADERS;

    jest
      .spyOn(context.jwtService, 'verifyAsync')
      .mockResolvedValue({ sessionId: SESSION_ID });

    jest
      .spyOn(context.sessionDA, 'findOneBySessionId')
      .mockResolvedValue(SESSION_MOCK_DB);
  });

  and('the eventDate has not already ended', () => {
    jest
      .spyOn(context.eventDA, 'findOneById')
      .mockResolvedValue(FUTURE_EVENT_MOCK_DTO);
  });

  // ###### MOB-TC-54 ######
  and(
    /^I am (.*), the accessToken is (.*) and the eventId has been provided$/,
    (authenticatedStatus, accessToken) => {
      if (authenticatedStatus === 'unauthenticated') {
        jest
          .spyOn(context.sessionDA, 'findOneBySessionId')
          .mockResolvedValue(null);
      }

      if (authenticatedStatus === 'authenticated') {
        jest
          .spyOn(context.sessionDA, 'findOneBySessionId')
          .mockResolvedValue(SESSION_MOCK_DB);
      }

      if (accessToken === 'valid') {
        context.headers = HEADERS;

        jest
          .spyOn(context.jwtService, 'verifyAsync')
          .mockResolvedValue({ sessionId: SESSION_ID });
      }

      if (accessToken === 'not_exist') {
        context.headers = { 'Content-Type': 'application/json' };
      }

      if (accessToken === 'expired') {
        context.headers = HEADERS;

        jest.spyOn(context.jwtService, 'verifyAsync').mockRejectedValue({});
      }

      if (accessToken === 'null') {
        context.headers = {
          'Content-Type': 'application/json',
          Authorization: null,
        };
      }
    },
  );

  // ###### MOB-TC-57 ######
  and('the eventId is not in the db', () => {
    jest.spyOn(context.eventDA, 'findOneById').mockResolvedValue(null);
  });

  // ###### MOB-TC-98 ######
  and('the eventDate has already ended', () => {
    jest
      .spyOn(context.eventDA, 'findOneById')
      .mockResolvedValue(OLD_EVENT_MOCK_DTO);
  });
};
