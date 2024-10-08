import { JwtService } from '@nestjs/jwt';
import { StepDefinitions } from 'jest-cucumber';
import { context, moduleFixture } from '../../../steps-config';
import {
  EventRepository,
  AccountRepository,
  TokensRepository,
  EventParticipantsRepository,
} from '../../../../../src/infrastructure/db/repositories';
import {
  FUTURE_EVENT_MOCK_DB,
  PAIR_OF_TOKENS_MOCK_DB,
  getUserMockDb,
} from '../../../../mocks/db';
import { EVENT_ID_MOCK } from '../../../../mocks/dtos';
import { HEADERS } from '../../../../mocks/common-data';
import { ACCOUNT_ROLES } from '../../../../../src/domain/const';

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

    context.eventRepository =
      moduleFixture.get<EventRepository>(EventRepository);

    context.accountRepository =
      moduleFixture.get<AccountRepository>(AccountRepository);

    context.tokensRepository =
      moduleFixture.get<TokensRepository>(TokensRepository);

    context.eventParticipantsRepository =
      moduleFixture.get<EventParticipantsRepository>(
        EventParticipantsRepository,
      );

    jest.spyOn(context.eventRepository, 'removeById').mockResolvedValue(null);

    jest
      .spyOn(context.eventParticipantsRepository, 'removeByEventId')
      .mockResolvedValue(null);
  });

  and('use accessToken valid and eventId event_exist', async () => {
    const ADMIN_USER = {
      ...(await getUserMockDb()),
      role: ACCOUNT_ROLES.ADMIN,
    };

    jest.spyOn(context.jwtService, 'verifyAsync').mockResolvedValue({});

    jest
      .spyOn(context.tokensRepository, 'findOneByAccessToken')
      .mockResolvedValue(PAIR_OF_TOKENS_MOCK_DB);

    jest
      .spyOn(context.accountRepository, 'findOneById')
      .mockResolvedValue(ADMIN_USER);

    jest
      .spyOn(context.eventRepository, 'findOneById')
      .mockResolvedValue(FUTURE_EVENT_MOCK_DB);
  });

  // ###### MOB-TC-36 ######
  and('use accessToken is valid and eventId do not exist', () => {
    jest.spyOn(context.jwtService, 'verifyAsync').mockResolvedValue({});

    jest
      .spyOn(context.tokensRepository, 'findOneByAccessToken')
      .mockResolvedValue(null);
  });

  // ###### MOB-TC-37 ######
  and('use accessToken invalid and eventId event_exist', () => {
    jest.spyOn(context.jwtService, 'verifyAsync').mockRejectedValue({});
  });

  // ###### MOB-TC-38 ######
  and(
    'use accessToken without enough privileges and eventId event_exist',
    async () => {
      const USER = await getUserMockDb();

      jest.spyOn(context.jwtService, 'verifyAsync').mockResolvedValue({});

      jest
        .spyOn(context.tokensRepository, 'findOneByAccessToken')
        .mockResolvedValue(PAIR_OF_TOKENS_MOCK_DB);

      jest
        .spyOn(context.accountRepository, 'findOneById')
        .mockResolvedValue(USER);

      jest
        .spyOn(context.eventRepository, 'findOneById')
        .mockResolvedValue(FUTURE_EVENT_MOCK_DB);
    },
  );
};
