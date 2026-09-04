import { JwtService } from '@nestjs/jwt';
import { StepDefinitions } from 'jest-cucumber';
import { context, moduleFixture } from '../../../steps-config';
import {
  FUTURE_EVENT_MOCK_DTO,
  OLD_EVENT_MOCK_DTO,
} from '../../../../mocks/db';
import { EVENT_ID_MOCK } from '../../../../mocks/dtos';
import { HEADERS } from '../../../../mocks/common-data';
import { EventDA } from '../../../../../src/infrastructure/db/modules/none/event-da';
import { EventParticipantsDA } from '../../../../../src/infrastructure/db/modules/none/event-participant-da';
import { SessionDA } from '../../../../../src/infrastructure/db/modules/none/session-da';

const PATH = '/v1/account/events';

const METHOD = 'delete';

const BODY = { ...EVENT_ID_MOCK };

export const disjoinEventSteps: StepDefinitions = ({ given, and }) => {
  given('the DELETE Disjoin event API is available', () => {
    context.path = PATH;

    context.method = METHOD;

    context.headers = HEADERS;

    context.mock = BODY;

    context.jwtService = moduleFixture.get<JwtService>(JwtService);

    context.eventDA = moduleFixture.get<EventDA>(EventDA);

    context.sessionDA = moduleFixture.get<SessionDA>(SessionDA);

    context.eventParticipantsDA =
      moduleFixture.get<EventParticipantsDA>(EventParticipantsDA);

    jest
      .spyOn(context.eventDA, 'findOneById')
      .mockResolvedValue(FUTURE_EVENT_MOCK_DTO);

    jest
      .spyOn(context.eventParticipantsDA, 'removeParticipantFromList')
      .mockResolvedValue(null);
  });

  // TC-102
  and('I am not authenticated', () => {
    jest.spyOn(context.jwtService, 'verifyAsync').mockRejectedValue({});
  });

  // TC-103
  and('i provide a valid eventId for an event I am not joined', () => {
    jest
      .spyOn(context.eventDA, 'findOneById')
      .mockResolvedValue(FUTURE_EVENT_MOCK_DTO);
  });

  // TC-101
  and('i have provided a eventId that do not exist in the DB', () => {
    jest.spyOn(context.eventDA, 'findOneById').mockResolvedValue(null);
  });

  // TC-140
  and('i have provided a valid eventId that has a past date', () => {
    jest
      .spyOn(context.eventDA, 'findOneById')
      .mockResolvedValue(OLD_EVENT_MOCK_DTO);
  });
};
