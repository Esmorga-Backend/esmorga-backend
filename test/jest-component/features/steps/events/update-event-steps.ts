import { JwtService } from '@nestjs/jwt';
import { StepDefinitions } from 'jest-cucumber';
import { context, moduleFixture } from '../../../steps-config';
import {
  AccountRepository,
  EventRepository,
  TokensRepository,
} from '../../../../../src/infrastructure/db/repositories';
import {
  getUserMockDb,
  FUTURE_EVENT_MOCK_DB,
  PAIR_OF_TOKENS_MOCK_DB,
  UPDATED_EVENT_MOCK_DB,
} from '../../../../mocks/db';
import { EVENT_MOCK } from '../../../../mocks/dtos';
import { HEADERS } from '../../../../mocks/common-data';
import { ACCOUNT_ROLES } from '../../../../../src/domain/const';

export const updateEventSteps: StepDefinitions = ({ given }) => {
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
    jest
      .spyOn(context.eventRepository, 'updateById')
      .mockResolvedValue(UPDATED_EVENT_MOCK_DB);
    jest
      .spyOn(context.tokensRepository, 'findOneByAccessToken')
      .mockResolvedValue(null);
  });
};
