import { JwtService } from '@nestjs/jwt';
import { StepDefinitions } from 'jest-cucumber';
import { context, moduleFixture } from '../../../steps-config';
import {
  EventRepository,
  TokensRepository,
  EventParticipantsRepository,
} from '../../../../../src/infrastructure/db/repositories';
import { FUTURE_EVENT_MOCK_DB, OLD_EVENT_MOCK_DB } from '../../../../mocks/db';
import { EVENT_ID_MOCK } from '../../../../mocks/dtos';

const PATH = '/v1/account/events';

const METHOD = 'delete';

const HEADERS = {
  'Content-Type': 'application/json',
  Authorization: 'Bearer accessToken',
};

const BODY = { ...EVENT_ID_MOCK };

export const disjoinEventSteps: StepDefinitions = ({ given, and }) => {
  given('the DELETE Disjoin event API is available', () => {
    context.path = PATH;

    context.method = METHOD;

    context.headers = HEADERS;

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
      .spyOn(context.eventRepository, 'findOneById')
      .mockResolvedValue(FUTURE_EVENT_MOCK_DB);

    jest
      .spyOn(context.eventParticipantsRepository, 'removePartipantFromList')
      .mockResolvedValue(null);
  });

  // TC-102
  and('I am not authenticated', () => {
    jest.spyOn(context.jwtService, 'verifyAsync').mockRejectedValue({});
  });

  // TC-103
  and('i provide a valid eventId for an event I am not joined', () => {
    jest
      .spyOn(context.eventRepository, 'findOneById')
      .mockResolvedValue(FUTURE_EVENT_MOCK_DB);
  });

  // TC-101
  and('i have provided a eventId that do not exist in the DB', () => {
    jest.spyOn(context.eventRepository, 'findOneById').mockResolvedValue(null);
  });

  // TC-140
  and('i have provided a valid eventId that has a past date', () => {
    jest
      .spyOn(context.eventRepository, 'findOneById')
      .mockResolvedValue(OLD_EVENT_MOCK_DB);
  });
};
