import { JwtService } from '@nestjs/jwt';
import { StepDefinitions } from 'jest-cucumber';
import { context, moduleFixture } from '../../../steps-config';
import {
  FUTURE_EVENT_MOCK_DTO,
  getUserProfile,
  SESSION_MOCK_DB,
  UPDATED_EVENT_MOCK_DTO,
} from '../../../../mocks/db';
import { EVENT_MOCK } from '../../../../mocks/dtos';
import { HEADERS } from '../../../../mocks/common-data';
import { ACCOUNT_ROLES } from '../../../../../src/domain/const';
import { SESSION_ID } from '../../../../mocks/db/common';
import { UserDA } from '../../../../../src/infrastructure/db/modules/none/user-da';
import { SessionDA } from '../../../../../src/infrastructure/db/modules/none/session-da';
import { EventDA } from '../../../../../src/infrastructure/db/modules/none/event-da';

export const updateEventSteps: StepDefinitions = ({ given }) => {
  // ###### MOB-TC-73 ######
  given('the PATCH Update Event API is available', async () => {
    context.path = '/v1/events';
    context.method = 'patch';
    context.headers = HEADERS;
    context.mock = { ...EVENT_MOCK };

    context.jwtService = moduleFixture.get<JwtService>(JwtService);

    context.userDA = moduleFixture.get<UserDA>(UserDA);

    context.eventDA = moduleFixture.get<EventDA>(EventDA);

    context.sessionDA = moduleFixture.get<SessionDA>(SessionDA);

    const ADMIN_USER = {
      ...(await getUserProfile()),
      role: ACCOUNT_ROLES.ADMIN,
    };

    jest
      .spyOn(context.jwtService, 'verifyAsync')
      .mockResolvedValue({ sessionId: SESSION_ID });
    jest
      .spyOn(context.sessionDA, 'findOneBySessionId')
      .mockResolvedValue(SESSION_MOCK_DB);
    jest.spyOn(context.userDA, 'findOneById').mockResolvedValue(ADMIN_USER);
    jest
      .spyOn(context.eventDA, 'findOneById')
      .mockResolvedValue(FUTURE_EVENT_MOCK_DTO);
    jest
      .spyOn(context.eventDA, 'updateById')
      .mockResolvedValue(UPDATED_EVENT_MOCK_DTO);
    jest.spyOn(context.sessionDA, 'findOneBySessionId').mockResolvedValue(null);
  });
};
