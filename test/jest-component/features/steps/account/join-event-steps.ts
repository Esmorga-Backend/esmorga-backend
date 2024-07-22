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
} from '../../../../mocks/db';

const PATH = '/v1/account/events';

const METHOD = 'post';

const HEADERS = {
  'Content-Type': 'application/json',
  Authorization: 'Bearer accessToken',
};

const BODY = {
  eventId: 'eventId',
};

export const joinEventSteps: StepDefinitions = ({ given, and }) => {
  // ###### MOB-TC-53 ######
  given('I am authenticated', () => {
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
      .spyOn(context.tokensRepository, 'findOneByAccessToken')
      .mockResolvedValue(PAIR_OF_TOKENS_MOCK_DB);

    jest
      .spyOn(
        context.eventParticipantsRepository,
        'findAndUpdateParticipantsList',
      )
      .mockResolvedValue(null);
  });

  and('the accessToken is valid', () => {
    jest.spyOn(context.jwtService, 'verifyAsync').mockResolvedValue({});
  });

  and('the eventId is valid', () => {
    jest
      .spyOn(context.eventRepository, 'findByIdentifier')
      .mockResolvedValue(FUTURE_EVENT_MOCK_DB);
  });

  // ###### MOB-TC-54 ######
  given(/^I am (.*)$/, (authenticatedStatus) => {
    context.path = PATH;

    context.method = METHOD;

    context.jwtService = moduleFixture.get<JwtService>(JwtService);

    context.eventRepository =
      moduleFixture.get<EventRepository>(EventRepository);

    context.tokensRepository =
      moduleFixture.get<TokensRepository>(TokensRepository);

    context.eventParticipantsRepository =
      moduleFixture.get<EventParticipantsRepository>(
        EventParticipantsRepository,
      );

    if (authenticatedStatus === 'unauthenticated') {
      jest
        .spyOn(context.tokensRepository, 'findOneByAccessToken')
        .mockResolvedValue(null);
    }

    if (authenticatedStatus === 'authenticated') {
      jest
        .spyOn(context.tokensRepository, 'findOneByAccessToken')
        .mockResolvedValue(PAIR_OF_TOKENS_MOCK_DB);
    }
  });

  and(/^the accessToken is (.*)$/, (accessToken) => {
    if (accessToken === 'valid') {
      context.headers = HEADERS;

      jest.spyOn(context.jwtService, 'verifyAsync').mockResolvedValue({});
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
  });

  and('the eventid has been provided', () => {
    context.mock = BODY;
  });

  // ###### MOB-TC-98 ######
  given('I am authenticated with a valid accessToken', () => {
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

    jest.spyOn(context.jwtService, 'verifyAsync').mockResolvedValue({});

    jest
      .spyOn(context.tokensRepository, 'findOneByAccessToken')
      .mockResolvedValue(PAIR_OF_TOKENS_MOCK_DB);

    jest
      .spyOn(
        context.eventParticipantsRepository,
        'findAndUpdateParticipantsList',
      )
      .mockResolvedValue(null);
  });

  and('i have provided a valid eventId', () => {});

  and('the eventDate has already ended', () => {
    jest
      .spyOn(context.eventRepository, 'findByIdentifier')
      .mockResolvedValue(OLD_EVENT_MOCK_DB);
  });
};
