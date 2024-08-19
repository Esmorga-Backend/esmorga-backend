import { JwtService } from '@nestjs/jwt';
import { StepDefinitions } from 'jest-cucumber';
import { context, moduleFixture } from '../../../steps-config';
import {
  CREATE_EVENT_MOCK,
  CREATE_EVENT_WITHOUT_OPTIONAL_FIELDS_MOCK,
} from '../../../../mocks/dtos';
import {
  AccountRepository,
  EventRepository,
  TokensRepository,
} from '../../../../../src/infrastructure/db/repositories';
import {
  getAdminUserMockDb,
  getUserMockDb,
  PAIR_OF_TOKENS_MOCK_DB,
} from '../../../../mocks/db';

const HEADERS = {
  'Content-Type': 'application/json',
  Authorization: 'Bearer accessToken',
};

export const createEventSteps: StepDefinitions = ({ given, and }) => {
  // ###### MOB-TC-19 ######
  given('the POST Events API is available', () => {
    context.path = '/v1/events';
    context.method = 'post';
    context.headers = HEADERS;
    context.mock = { ...CREATE_EVENT_MOCK };

    context.jwtService = moduleFixture.get<JwtService>(JwtService);

    context.accountRepository =
      moduleFixture.get<AccountRepository>(AccountRepository);

    context.eventRepository =
      moduleFixture.get<EventRepository>(EventRepository);

    context.tokensRepository =
      moduleFixture.get<TokensRepository>(TokensRepository);

    jest.spyOn(context.jwtService, 'verifyAsync').mockResolvedValue({});

    jest
      .spyOn(context.tokensRepository, 'findOneByAccessToken')
      .mockResolvedValue(PAIR_OF_TOKENS_MOCK_DB);

    jest.spyOn(context.eventRepository, 'save').mockResolvedValue(null);
  });

  and('an authenticated user with admin rights is logged in', async () => {
    const USER_ADMIN = await getAdminUserMockDb();

    jest
      .spyOn(context.accountRepository, 'findOneById')
      .mockResolvedValue(USER_ADMIN);
  });

  and(
    /^with valid data to create an event, use tags: (.*), imageUrl: (.*), location.lat(.*) and location.long:(.*)$/,
    (tags, imageUrl, lat, long) => {
      if (tags === '' && imageUrl === '' && lat === '' && long === '') {
        context.mock = { ...CREATE_EVENT_WITHOUT_OPTIONAL_FIELDS_MOCK };
      }
    },
  );

  and('an unauthenticated user', () => {
    jest
      .spyOn(context.tokensRepository, 'findOneByAccessToken')
      .mockResolvedValue(null);
  });

  and('an authenticated user without admin rights is logged in', async () => {
    const USER = await getUserMockDb();

    jest
      .spyOn(context.accountRepository, 'findOneById')
      .mockResolvedValue(USER);
  });
};
