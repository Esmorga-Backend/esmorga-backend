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

export const joinEventSteps: StepDefinitions = ({ given, and }) => {
  // ###### MOB-TC-53 ######
  given('I am authenticated', async () => {
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

  // ###### MOB-TC-98 ######
  given('I am authenticated with a valid accessToken', async () => {
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
