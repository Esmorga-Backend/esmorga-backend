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
import { ACCOUNT_ROLES } from '../../../../../src/domain/const';
import { getUserMockDb, SESSION_MOCK_DB } from '../../../../mocks/db';

import { HEADERS } from '../../../../mocks/common-data';
import { SESSION_ID } from '../../../../mocks/db/common';

export const createEventSteps: StepDefinitions = ({ given, and }) => {
  // ###### TC-19 ######
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

    jest
      .spyOn(context.jwtService, 'verifyAsync')
      .mockResolvedValue({ sessionId: SESSION_ID });

    jest
      .spyOn(context.tokensRepository, 'findOneBySessionId')
      .mockResolvedValue(SESSION_MOCK_DB);

    jest.spyOn(context.eventRepository, 'save').mockResolvedValue(null);
  });

  and('an authenticated user with admin rights is logged in', async () => {
    const ADMIN_USER = {
      ...(await getUserMockDb()),
      role: ACCOUNT_ROLES.ADMIN,
    };

    jest
      .spyOn(context.accountRepository, 'findOneById')
      .mockResolvedValue(ADMIN_USER);
  });

  and(
    /^with valid data to create an event, use tags: (.*), imageUrl: (.*), location.lat(.*) and location.long:(.*)$/,
    (tags, imageUrl, lat, long) => {
      if (tags === '' && imageUrl === '' && lat === '' && long === '') {
        context.mock = { ...CREATE_EVENT_WITHOUT_OPTIONAL_FIELDS_MOCK };
      }
    },
  );

  // ###### TC-21 ######
  and('an unauthenticated user', () => {
    jest
      .spyOn(context.tokensRepository, 'findOneBySessionId')
      .mockResolvedValue(null);
  });

  // ###### TC-22 ######
  and('an authenticated user without admin rights is logged in', async () => {
    const USER = await getUserMockDb();

    jest
      .spyOn(context.accountRepository, 'findOneById')
      .mockResolvedValue(USER);
  });
};
