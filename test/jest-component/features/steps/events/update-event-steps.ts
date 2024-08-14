import { JwtService } from '@nestjs/jwt';
import { StepDefinitions } from 'jest-cucumber';
import { context, moduleFixture } from '../../../steps-config';
import {
  AccountRepository,
  EventRepository,
  TokensRepository,
} from '../../../../../src/infrastructure/db/repositories';
import {
  getAdminUserMockDb,
  FUTURE_EVENT_MOCK_DB,
  PAIR_OF_TOKENS_MOCK_DB,
  UPDATED_EVENT_MOCK_DB,
} from '../../../../mocks/db';
import { EVENT_MOCK } from '../../../../mocks/dtos';

const HEADERS = {
  'Content-Type': 'application/json',
  Authorization: 'Bearer accessToken',
};

export const updateEventSteps: StepDefinitions = ({ given, and }) => {
  // ###### MOB-TC-73 ######
  given('the PATCH Update Event API is available', async () => {
    context.path = '/v1/events';
    context.method = 'patch';
    context.headers = HEADERS;
    context.mock = { ...EVENT_MOCK };

    context.jwtService = moduleFixture.get<JwtService>(JwtService);

    context.accountRepository =
      moduleFixture.get<AccountRepository>(AccountRepository);

    context.eventRepository =
      moduleFixture.get<EventRepository>(EventRepository);

    context.tokensRepository =
      moduleFixture.get<TokensRepository>(TokensRepository);

    const USER_ADMIN = await getAdminUserMockDb();

    jest.spyOn(context.jwtService, 'verifyAsync').mockResolvedValue({});
    jest
      .spyOn(context.tokensRepository, 'findOneByAccessToken')
      .mockResolvedValue(PAIR_OF_TOKENS_MOCK_DB);
    jest
      .spyOn(context.accountRepository, 'findOneById')
      .mockResolvedValue(USER_ADMIN);
    jest
      .spyOn(context.eventRepository, 'findOneById')
      .mockResolvedValue(FUTURE_EVENT_MOCK_DB);
    jest
      .spyOn(context.eventRepository, 'updateById')
      .mockResolvedValue(UPDATED_EVENT_MOCK_DB);
    jest
      .spyOn(context.tokensRepository, 'findOneByAccessToken')
      .mockResolvedValue(null);
  });
};
