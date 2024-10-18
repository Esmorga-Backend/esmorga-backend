import { JwtService } from '@nestjs/jwt';
import { StepDefinitions } from 'jest-cucumber';
import { context, moduleFixture } from '../../../steps-config';
import {
  CREATE_EVENT_MOCK,
  CREATE_EVENT_WITHOUT_OPTIONAL_FIELDS_MOCK,
} from '../../../../mocks/dtos';
import { ACCOUNT_ROLES } from '../../../../../src/domain/const';
import { getUserProfile, SESSION_MOCK_DB } from '../../../../mocks/db';

import { HEADERS } from '../../../../mocks/common-data';
import { SESSION_ID } from '../../../../mocks/db/common';
import { UserDA } from '../../../../../src/infrastructure/db/modules/none/user-da';
import { EventDA } from '../../../../../src/infrastructure/db/modules/none/event-da';
import { SessionDA } from '../../../../../src/infrastructure/db/modules/none/session-da';

export const createEventSteps: StepDefinitions = ({ given, and }) => {
  // ###### TC-19 ######
  given('the POST Events API is available', () => {
    context.path = '/v1/events';
    context.method = 'post';
    context.headers = HEADERS;
    context.mock = { ...CREATE_EVENT_MOCK };

    context.jwtService = moduleFixture.get<JwtService>(JwtService);

    context.userDA = moduleFixture.get<UserDA>(UserDA);

    context.eventDA = moduleFixture.get<EventDA>(EventDA);

    context.sessionDA = moduleFixture.get<SessionDA>(SessionDA);

    jest
      .spyOn(context.jwtService, 'verifyAsync')
      .mockResolvedValue({ sessionId: SESSION_ID });

    jest
      .spyOn(context.sessionDA, 'findOneBySessionId')
      .mockResolvedValue(SESSION_MOCK_DB);

    jest.spyOn(context.eventDA, 'create').mockResolvedValue(null);
  });

  and('an authenticated user with admin rights is logged in', async () => {
    const ADMIN_USER = {
      ...(await getUserProfile()),
      role: ACCOUNT_ROLES.ADMIN,
    };

    jest.spyOn(context.userDA, 'findOneById').mockResolvedValue(ADMIN_USER);
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
    jest.spyOn(context.sessionDA, 'findOneBySessionId').mockResolvedValue(null);
  });

  // ###### TC-22 ######
  and('an authenticated user without admin rights is logged in', async () => {
    const USER = await getUserProfile();

    jest.spyOn(context.userDA, 'findOneById').mockResolvedValue(USER);
  });
};
