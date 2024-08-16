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
  PAIR_OF_TOKENS_MOCK_DB,
  EVENT_PARTICIPANT_MOCK_DB,
} from '../../../../mocks/db';

const PATH = '/v1/account/events';

const METHOD = 'get';

const HEADERS = {
  'Content-Type': 'application/json',
  Authorization: 'Bearer accessToken',
};

export const getMyEventsStepts: StepDefinitions = ({ given, and }) => {
  // TC-104 TC-105 TC-106 TC-107
  given('the GET My events API is available', () => {
    context.path = PATH;

    context.method = METHOD;

    context.headers = HEADERS;

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
      .spyOn(context.eventParticipantsRepository, 'findEventParticipant')
      .mockResolvedValue([EVENT_PARTICIPANT_MOCK_DB]);
  });

  // TC-104 TC-105 TC-107
  and('I am authenticated with a valid accessToken', () => {
    jest.spyOn(context.jwtService, 'verifyAsync').mockResolvedValue({});

    jest
      .spyOn(context.tokensRepository, 'findOneByAccessToken')
      .mockResolvedValue(PAIR_OF_TOKENS_MOCK_DB);
  });

  // TC-106
  and('I am using an invalid accessToken', () => {
    jest.spyOn(context.jwtService, 'verifyAsync').mockRejectedValue({});
  });

  // TC-105
  and('there are not upcoming events that I have joined', () => {
    jest
      .spyOn(context.eventParticipantsRepository, 'findEventParticipant')
      .mockResolvedValue([]);

    jest.spyOn(context.eventRepository, 'findByEventIds').mockResolvedValue([]);
  });

  // TC-104
  and('there are upcoming events that I have joined', () => {
    jest
      .spyOn(context.eventRepository, 'findByEventIds')
      .mockResolvedValue([FUTURE_EVENT_MOCK_DB]);
  });

  // TC-107
  and('I only joined celebrated events', () => {
    jest
      .spyOn(context.eventRepository, 'findByEventIds')
      .mockResolvedValue([OLD_EVENT_MOCK_DB]);
  });

  // TC-105 107
  and('the response must include a empty array', () => {
    expect(context.response.body).toEqual({
      totalEvents: 0,
      events: [],
    });
  });
};
