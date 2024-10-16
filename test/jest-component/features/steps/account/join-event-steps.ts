import { JwtService } from '@nestjs/jwt';
import { StepDefinitions } from 'jest-cucumber';
import { context, moduleFixture } from '../../../steps-config';
import {
  EventRepository,
  TokensRepository,
  EventParticipantsRepository,
} from '../../../../../src/infrastructure/db/repositories';
import {
  FUTURE_EVENT_MOCK_DB,
  OLD_EVENT_MOCK_DB,
  SESSION_MOCK_DB,
} from '../../../../mocks/db';
import { EVENT_ID_MOCK } from '../../../../mocks/dtos';
import { HEADERS } from '../../../../mocks/common-data';
import { SESSION_ID } from '../../../../mocks/db/common';

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

    context.eventRepository =
      moduleFixture.get<EventRepository>(EventRepository);

    context.tokensRepository =
      moduleFixture.get<TokensRepository>(TokensRepository);

    context.eventParticipantsRepository =
      moduleFixture.get<EventParticipantsRepository>(
        EventParticipantsRepository,
      );

    jest
      .spyOn(
        context.eventParticipantsRepository,
        'findAndUpdateParticipantsList',
      )
      .mockResolvedValue(null);
  });

  and('I am authenticated, with valid accessToken and eventId', () => {
    context.headers = HEADERS;

    jest
      .spyOn(context.jwtService, 'verifyAsync')
      .mockResolvedValue({ sessionId: SESSION_ID });

    jest
      .spyOn(context.tokensRepository, 'findOneBySessionId')
      .mockResolvedValue(SESSION_MOCK_DB);
  });

  and('the eventDate has not already ended', () => {
    jest
      .spyOn(context.eventRepository, 'findOneById')
      .mockResolvedValue(FUTURE_EVENT_MOCK_DB);
  });

  // ###### MOB-TC-54 ######
  and(
    /^I am (.*), the accessToken is (.*) and the eventId has been provided$/,
    (authenticatedStatus, accessToken) => {
      if (authenticatedStatus === 'unauthenticated') {
        jest
          .spyOn(context.tokensRepository, 'findOneBySessionId')
          .mockResolvedValue(null);
      }

      if (authenticatedStatus === 'authenticated') {
        jest
          .spyOn(context.tokensRepository, 'findOneBySessionId')
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
    jest.spyOn(context.eventRepository, 'findOneById').mockResolvedValue(null);
  });

  // ###### MOB-TC-98 ######
  and('the eventDate has already ended', () => {
    jest
      .spyOn(context.eventRepository, 'findOneById')
      .mockResolvedValue(OLD_EVENT_MOCK_DB);
  });
};
